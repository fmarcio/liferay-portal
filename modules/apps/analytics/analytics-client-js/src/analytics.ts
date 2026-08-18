/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {v4 as uuidv4} from 'uuid';

import {Demandbase} from './demandbase';
import middlewares from './middlewares/defaults';
import defaultPlugins from './plugins/defaults';
import QueueFlushService from './queueFlushService';
import AccountMessageQueue from './queues/accountMessageQueue';
import EventMessageQueue from './queues/eventMessageQueue';
import EventQueue from './queues/eventsQueue';
import IdentityMessageQueue from './queues/identityMessageQueue';
import {Segment} from './segment';
import {Analytics as AnalyticsType} from './types';
import {
	ANALYTICS_CLIENT_VERSION,
	FLUSH_INTERVAL,
	QUEUE_PRIORITY_ACCOUNT,
	QUEUE_PRIORITY_DEFAULT,
	QUEUE_PRIORITY_IDENTITY,
	VALIDATION_CONTEXT_VALUE_MAXIMUM_LENGTH,
} from './utils/constants';
import {getContexts, setContexts} from './utils/contexts';
import {normalizeEvent} from './utils/events';
import hash from './utils/hash';
import {getItem, removeItem, setItem} from './utils/storage';
import {upgradeStorage} from './utils/storage_version';
import {isValidEvent} from './utils/validators';

// Constants

export const ENV: any = window || global;

const COOKIE_EXPIRED_DATE = 'Thu, 01 Jan 1970 00:00:00 GMT';

const IP_ADDRESS_REGEX = /^[\d.]+$/;

/**
 * Analytics class that is designed to collect events that are captured
 * for later processing. It persists the events in localStorage
 * and flushes it to the defined endpoint at regular intervals.
 */
class Analytics {
	[AnalyticsType.Queues.AccountMessage]!: AccountMessageQueue;
	[AnalyticsType.Queues.Events]!: EventQueue;
	[AnalyticsType.Queues.Messages]!: EventMessageQueue;
	[AnalyticsType.Queues.IdentityMessage]!: IdentityMessageQueue;

	_disposed: boolean = false;
	_pluginDisposers: any[] = [];
	_queueFlushService!: QueueFlushService;

	config: AnalyticsType.Config = {
		channelId: '',
		dataSourceId: '',
		demandbaseAccountEndpoint: '',
		endpointUrl: '',
		faroBackendUrl: '',
		flushInterval: 0,
		identity: {
			emailAddressHashed: '',
		},
		identityEndpoint: '',
		projectId: '',
		userId: '',
	};
	demandbase!: Demandbase;
	middlewares: AnalyticsType.Middleware[] = [];
	segment!: Segment;
	version: string = '';

	/**
	 * Returns an Analytics instance and triggers the automatic flush loop
	 */
	constructor(
		config: AnalyticsType.Config,
		middlewares: AnalyticsType.Middleware[]
	) {
		if (this._isTrackingDisabled()) {
			return this;
		}

		this._disposed = false;

		const endpointUrl = (config.endpointUrl || '').replace(/\/$/, '');

		const faroBackendUrl = (config.faroBackendUrl || '').replace(/\/$/, '');

		this.config = Object.assign(config, {
			demandbaseAccountEndpoint: `${endpointUrl}/demandbase-account`,
			endpointUrl,
			faroBackendUrl,
			flushInterval: config.flushInterval || FLUSH_INTERVAL,
			identityEndpoint: `${endpointUrl}/identity`,
		});

		this.version = ANALYTICS_CLIENT_VERSION;

		// Register initial middlewares

		middlewares.forEach((middleware) =>
			this.registerMiddleware(middleware)
		);

		this._queueFlushService = new QueueFlushService(this.config);

		this._initializeEventQueue();
		this._initializeEventMessageQueue();
		this._initializeIdentityMessageQueue();
		this._initializeAccountMessageQueue();

		this.demandbase = new Demandbase(this);
		this.segment = new Segment(this);

		// Upgrade storage

		upgradeStorage();

		// Initializes default plugins

		this._pluginDisposers = defaultPlugins.map((plugin) => plugin(this));

		this._ensureIntegrity();

		return this;
	}

	/**
	 * Creates a singleton instance of Analytics
	 * @example
	 * Analytics.create(
	 *   {
	 *     channelId: '123456789',
	 *     dataSourceId: 'MyDataSourceId',
	 *     endpointUrl: 'https://osbasahpublisher-projectid.lfr.cloud'
	 *     flushInterval: 2000,
	 *     projectId: '123456'
	 *     userId: 'id-s7uatimmxgo',
	 *   }
	 * );
	 */
	static create(
		config: AnalyticsType.Config,
		middlewares: AnalyticsType.Middleware[] = []
	) {
		const self = new Analytics(config, middlewares);
		const Liferay = window.Liferay;

		ENV.Analytics = self;
		ENV.Analytics.create = Analytics.create;
		ENV.Analytics.dispose = Analytics.dispose;

		let email = '';
		let name = '';

		if (
			Liferay &&
			Liferay.ThemeDisplay &&
			Liferay.ThemeDisplay.getUserEmailAddress &&
			!!Liferay.ThemeDisplay.getUserEmailAddress().length &&
			Liferay.ThemeDisplay.getUserName &&
			!!Liferay.ThemeDisplay.getUserName().length
		) {
			email = Liferay.ThemeDisplay.getUserEmailAddress();
			name = Liferay.ThemeDisplay.getUserName();
		}

		self.setIdentity({
			email,
			name,
		});

		return self;
	}

	/**
	 * Disposes events and stops interval timer
	 */
	static dispose() {
		const self = ENV.Analytics;

		if (self && !self._isTrackingDisabled()) {
			self._disposeInternal();
		}
	}

	getEvents() {
		return this[
			AnalyticsType.Queues.Events
		].getItems<AnalyticsType.Event>();
	}

	getBatchSegmentExternalReferenceCodes() {
		return this.segment.getBatchSegmentExternalReferenceCodes();
	}

	getRealTimeSegmentExternalReferenceCodes() {
		return this.segment.getRealTimeSegmentExternalReferenceCodes();
	}

	/**
	 * Registers the given plugin and executes its initialization logic
	 */
	registerPlugin(plugin: (analytics: Analytics) => void) {
		if (typeof plugin === 'function') {
			plugin(this);
		}
	}

	/**
	 * Registers the given middleware. This middleware will be later on called
	 * with the request object and this Analytics instance
	 * @example
	 * AnalyticsType.registerMiddleware(
	 *   (request) => {
	 *     ...
	 *   }
	 * );
	 */
	registerMiddleware(middleware: AnalyticsType.Middleware) {
		if (this._isTrackingDisabled()) {
			return;
		}

		if (typeof middleware === 'function') {
			middlewares.push(middleware);
		}
	}

	/**
	 * Clear event queue and set stored context to the current context.
	 */
	reset() {
		if (this._isTrackingDisabled()) {
			return;
		}

		this[AnalyticsType.Queues.Events].reset();

		this.resetContext();
	}

	/**
	 * Set stored context to the current context.
	 */
	resetContext() {
		const context = this._getContext();

		const contextsMap = new Map();
		contextsMap.set(hash(context), context);

		setContexts(contextsMap);
	}

	/**
	 * Registers an event that is to be sent to Analytics Cloud
	 */
	track(
		eventId: AnalyticsType.EventId,
		eventProps?: AnalyticsType.EventProps,
		options = {}
	) {
		const {assetType, ...otherEventProps} = eventProps || {};

		const mergedOptions = {
			...{applicationId: AnalyticsType.ApplicationId.CustomEvent},
			...options,
		};

		const applicationId = assetType || mergedOptions.applicationId;

		if (
			this._isTrackingDisabled() ||
			this._disposed ||
			!isValidEvent({
				applicationId,
				eventId,
				eventProps: otherEventProps,
			})
		) {
			return;
		}

		const currentContextHash = this._getCurrentContextHash();

		this[AnalyticsType.Queues.Events].addItem(
			normalizeEvent(
				eventId,
				applicationId as AnalyticsType.ApplicationId,
				otherEventProps,
				currentContextHash
			)
		);
	}

	/**
	 * Registers an event that is to be sent to Analytics Cloud
	 */
	send(
		eventId: AnalyticsType.EventId,
		applicationId: AnalyticsType.ApplicationId,
		eventProps?: AnalyticsType.EventProps
	) {
		if (!applicationId) {
			return;
		}

		this.track(eventId, eventProps, {applicationId});
	}

	/**
	 * Sets the current user identity in the system. This is meant to be invoked
	 * by consumers every time an identity change is detected. If the identity is
	 * different than the previously stored one, we will save this new identity and
	 * send a request updating the Identity Service.
	 */
	setIdentity(identity: {email: string; name: string}) {
		if (this._isTrackingDisabled()) {
			return;
		}

		const hashedIdentity = {
			emailAddressHashed: identity.email
				? hash(identity.email.toLowerCase())
				: '',
		};

		this.config.identity = hashedIdentity;

		const userId = this._getUserId();

		this._sendIdentity(hashedIdentity, userId);

		this.demandbase.sendAccountMessage(userId);

		return Promise.resolve(userId);
	}

	/**
	 * Adopts the user id already established in the cookie shared with every
	 * sibling subdomain, so a subdomain the visitor reaches without a click
	 * through recognizes them instead of minting a second identity. Returns an
	 * empty string when there is no shared cookie to adopt from.
	 */
	_adoptSharedUserId() {
		if (!this._getCookieDomain()) {
			return '';
		}

		const sharedUserId = this._getCookie(AnalyticsType.Keys.UserId);

		if (!sharedUserId) {
			return '';
		}

		setItem(AnalyticsType.Keys.UserId, sharedUserId);

		return sharedUserId;
	}

	/**
	 * Clears interval and calls plugins disposers if available
	 */
	_disposeInternal() {
		this._disposed = true;

		if (this._queueFlushService) {
			this._queueFlushService.dispose();
		}

		if (this._pluginDisposers.length) {
			this._pluginDisposers
				.filter((disposer) => typeof disposer === 'function')
				.forEach((disposer) => disposer());
		}
	}

	_ensureIntegrity() {
		if (this._getCookieDomain()) {

			// Retires the cookie a previous version of the client scoped to
			// this exact host before anything reads the shared one. A cookie is
			// identified by its domain as well as its name, so leaving it in
			// place would let two cookies with the same name coexist and make
			// every later read, here and on the server, ambiguous.

			this._removeHostOnlyCookie(AnalyticsType.Keys.UserId);
		}

		const userId = getItem<string>(AnalyticsType.Keys.UserId);

		if (userId) {
			this._setUserIdCookie(userId);
		}
	}

	_getCurrentContextHash() {
		const currentContext = this._getContext();
		const currentContextHash = hash(currentContext);
		const contextsMap = getContexts();

		if (!contextsMap.has(currentContextHash)) {
			contextsMap.set(currentContextHash, currentContext);

			setContexts(contextsMap);
		}

		return currentContextHash;
	}

	_getContext() {
		const {context} = middlewares.reduce(
			(request, middleware) => middleware(request),
			{
				context: {
					channelId: this.config.channelId,
				} as AnalyticsType.Context,
			}
		);

		const clonedContext = {...context};

		for (const key in clonedContext) {
			clonedContext[key] = String(clonedContext[key]).slice(
				0,
				VALIDATION_CONTEXT_VALUE_MAXIMUM_LENGTH
			);
		}

		return clonedContext;
	}

	/**
	 * Reads a browser cookie through the same API that wrote it
	 * @protected
	 */
	_getCookie(key: string) {
		const Liferay = window.Liferay;

		if (Liferay?.Util?.Cookie) {
			return (
				Liferay.Util.Cookie.get?.(
					key,
					Liferay?.Util?.Cookie?.TYPES?.PERSONALIZATION
				) || ''
			);
		}

		const cookie = document.cookie
			.split('; ')
			.find((item) => item.startsWith(`${key}=`));

		return cookie ? cookie.slice(key.length + 1) : '';
	}

	/**
	 * Returns the domain the user id cookie is shared at, which the server
	 * computes from the request. Returns an empty string when there is nothing
	 * to share with, or when the browser would reject the configured value,
	 * leaving the cookie scoped to the exact host as it was before.
	 * @protected
	 */
	_getCookieDomain() {
		const cookieDomain = (this.config.cookieDomain || '').replace(
			/^\./,
			''
		);

		const {hostname} = window.location;

		if (
			!cookieDomain.includes('.') ||
			IP_ADDRESS_REGEX.test(cookieDomain) ||
			(hostname !== cookieDomain &&
				!hostname.endsWith(`.${cookieDomain}`))
		) {
			return '';
		}

		return cookieDomain;
	}

	_getIdentityHash(
		dataSourceId: string,
		identity: AnalyticsType.Config['identity'],
		userId: string
	) {
		const bodyData = {
			dataSourceId,
			identity,
			userId,
		};

		return hash(bodyData);
	}

	/**
	 * Gets the userId for the existing analytics user. Previously generated ids
	 * are stored and retrieved before generating a new one. If an anonymous
	 * navigation is started after an identified navigation, the user ID token
	 * is regenerated.
	 */
	_getUserId() {
		let userId = getItem<string>(AnalyticsType.Keys.UserId);

		const {emailAddressHashed} = this.config.identity;
		const previousEmailAddressHashed = getItem<string>(
			AnalyticsType.Keys.PrevEmailAddressHash
		);

		// An identified visit is stitched by its email hash downstream, so it
		// gains nothing from adopting the shared anonymous id and could bind
		// that id to a second person.

		if (!userId && !emailAddressHashed) {
			userId = this._adoptSharedUserId();
		}

		if (!userId) {
			userId = this._generateUserId();
		}

		if (
			emailAddressHashed &&
			emailAddressHashed !== previousEmailAddressHashed
		) {
			if (previousEmailAddressHashed) {
				userId = this._generateUserId();
			}

			setItem(
				AnalyticsType.Keys.PrevEmailAddressHash,
				emailAddressHashed
			);
		}

		return userId;
	}

	/**
	 * Returns a unique identifier for a user, additionally it stores
	 * the generated token to the local storage cache and clears
	 * previously stored identity hash.
	 */
	_generateUserId() {
		const userId: string = uuidv4();

		setItem(AnalyticsType.Keys.UserId, userId);
		this._setUserIdCookie(userId);

		removeItem(AnalyticsType.Keys.Identity);

		return userId;
	}

	_isTrackingDisabled() {
		return (
			ENV[AnalyticsType.Keys.DisableTracking] ||
			navigator.doNotTrack === '1' ||
			navigator.doNotTrack === 'yes'
		);
	}

	/**
	 * Expires the cookie scoped to this exact host, which is the one a previous
	 * version of the client wrote. Omitting the domain is what makes the
	 * browser expire that cookie rather than the shared one.
	 * @protected
	 */
	_removeHostOnlyCookie(key: string) {
		const path = window.Liferay?.ThemeDisplay?.getPathContext?.() || '/';

		// The cookie can sit at the path context, which is where this client
		// writes it without the Liferay cookie API, or at the root path, which
		// is where that API writes it.

		const paths = new Set([path, '/']);

		paths.forEach((cookiePath) => {
			document.cookie = `${key}=; expires=${COOKIE_EXPIRED_DATE}; path=${cookiePath}`;
		});
	}

	/**
	 * Sends the identity information and user id to the Identity Service.
	 */
	_sendIdentity(identity: AnalyticsType.Config['identity'], userId: string) {
		const {dataSourceId} = this.config;
		const {channelId} = this._getContext();

		const identityHash = this._getIdentityHash(
			dataSourceId,
			identity,
			userId
		);
		const storedIdentityHash = getItem<string>(AnalyticsType.Keys.Identity);
		const storedChannelId = getItem<string>(AnalyticsType.Keys.ChannelId);

		if (
			identityHash !== storedIdentityHash ||
			channelId !== storedChannelId
		) {
			const {emailAddressHashed} = identity;

			setItem(AnalyticsType.Keys.ChannelId, channelId);
			setItem(AnalyticsType.Keys.Identity, identityHash);

			this[AnalyticsType.Queues.IdentityMessage].addItem({
				channelId,
				dataSourceId,
				emailAddressHashed,
				id: identityHash,
				userId,
			});
		}
	}

	/**
	 * Sets a browser cookie
	 * @protected
	 */
	_setCookie(key: string, data: string) {
		const Liferay = window.Liferay;
		const cookieDomain = this._getCookieDomain();
		const expires = new Date();

		expires.setDate(expires.getDate() + 365);

		// Checks if the client is being loaded with the Liferay global
		// variable and if there is a Cookie method because the client
		// is Liferay Portal agnostic and may have versions that do not
		// yet have the Cookie method.

		if (Liferay?.Util?.Cookie) {
			const options: {
				domain?: string;
				expires: Date;
				secure: boolean;
			} = {
				expires,
				secure: true,
			};

			if (cookieDomain) {
				options.domain = cookieDomain;
			}

			Liferay.Util.Cookie.set?.(
				key,
				data,
				Liferay?.Util?.Cookie?.TYPES?.PERSONALIZATION,
				options
			);
		}
		else {
			const path = Liferay?.ThemeDisplay?.getPathContext?.() || '/';

			const cookie = [`${key}=${data}`];

			if (cookieDomain) {
				cookie.push(`domain=${cookieDomain}`);
			}

			cookie.push(
				`expires=${expires.toUTCString()}`,
				`path=${path}`,
				'Secure'
			);

			document.cookie = cookie.join('; ');
		}

		return;
	}

	/**
	 * Writes the user id cookie. Once the cookie is shared with every sibling
	 * subdomain the first id to reach it stays canonical, so it is only written
	 * when it holds nothing yet or already holds this same id: a subdomain that
	 * established its own id never replaces the one another subdomain shared.
	 * @protected
	 */
	_setUserIdCookie(userId: string) {
		if (this._getCookieDomain()) {
			const sharedUserId = this._getCookie(AnalyticsType.Keys.UserId);

			if (sharedUserId && sharedUserId !== userId) {
				return;
			}
		}

		this._setCookie(AnalyticsType.Keys.UserId, userId);
	}

	/**
	 * Create member instance of EventQueue to store events.
	 */
	_initializeEventQueue() {
		const eventQueue = new EventQueue({
			analyticsInstance: this,
		});

		this[AnalyticsType.Queues.Events] = eventQueue;

		this._queueFlushService.addQueue(eventQueue, {
			priority: QUEUE_PRIORITY_DEFAULT,
		});
	}

	/**
	 * Create member instance of EventMessageQueue to store event messages.
	 */
	_initializeEventMessageQueue() {
		const eventMessageQueue = new EventMessageQueue({
			analyticsInstance: this,
		});

		this[AnalyticsType.Queues.Messages] = eventMessageQueue;

		this._queueFlushService.addQueue(eventMessageQueue, {
			priority: QUEUE_PRIORITY_DEFAULT,
		});
	}

	/**
	 * Create member instance of IdentityMessageQueue to store identity messages.
	 */
	_initializeIdentityMessageQueue() {
		const identityMessageQueue = new IdentityMessageQueue({
			analyticsInstance: this,
		});

		this[AnalyticsType.Queues.IdentityMessage] = identityMessageQueue;

		this._queueFlushService.addQueue(identityMessageQueue, {
			priority: QUEUE_PRIORITY_IDENTITY,
		});
	}

	/**
	 * Create member instance of AccountMessageQueue to store Demandbase
	 * account messages.
	 */
	_initializeAccountMessageQueue() {
		const accountMessageQueue = new AccountMessageQueue({
			analyticsInstance: this,
		});

		this[AnalyticsType.Queues.AccountMessage] = accountMessageQueue;

		this._queueFlushService.addQueue(accountMessageQueue, {
			priority: QUEUE_PRIORITY_ACCOUNT,
		});
	}
}

// Exposes Analytics.create to the global scope

ENV.Analytics = {
	create: Analytics.create,
};

export {Analytics};
export default Analytics;
