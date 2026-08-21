/**
 * @jest-environment ./test/subdomainEnvironment.js
 */

/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

// @ts-ignore - Check possibility to install package in ts format

import fetchMock from 'fetch-mock';

import AnalyticsClient from '../src/analytics';
import {Analytics as AnalyticsType} from '../src/types';
import {getItem, setItem} from '../src/utils/storage';
import {INITIAL_ANALYTICS_CONFIG} from './helpers';

const COOKIE_DOMAIN = 'liferay.com';

const COOKIE_EXPIRED_DATE = 'Thu, 01 Jan 1970 00:00:00 GMT';

const INITIAL_CONFIG = {
	...INITIAL_ANALYTICS_CONFIG,
	endpointUrl: 'https://ac-server.io',
	faroBackendUrl: 'https://ac-backend-server.io',
	flushInterval: 100,
};

/**
 * Every value the browser holds under the user id cookie name. A cookie is
 * identified by its domain as well as its name, so a host scoped cookie and one
 * scoped to the shared domain show up here as two separate entries.
 */
const getUserIdCookies = () =>
	document.cookie
		.split('; ')
		.filter((cookie) => cookie.startsWith(`${AnalyticsType.Keys.UserId}=`))
		.map((cookie) => cookie.slice(AnalyticsType.Keys.UserId.length + 1));

const expireCookie = (domain?: string) => {
	const attributes = [`${AnalyticsType.Keys.UserId}=`];

	if (domain) {
		attributes.push(`domain=${domain}`);
	}

	attributes.push(`expires=${COOKIE_EXPIRED_DATE}`, 'path=/');

	document.cookie = attributes.join('; ');
};

/**
 * Expiring the host scoped cookie leaves a cookie written at the shared domain
 * untouched, which is the only way to tell the two apart through
 * `document.cookie`.
 */
const expireHostOnlyCookie = () => expireCookie();

const setCookie = (userId: string, domain?: string) => {
	const attributes = [`${AnalyticsType.Keys.UserId}=${userId}`];

	if (domain) {
		attributes.push(`domain=${domain}`);
	}

	attributes.push('path=/', 'Secure');

	document.cookie = attributes.join('; ');
};

describe('Cookie shared across subdomains', () => {
	beforeEach(() => {
		fetchMock.mock(/ac-server/i, () => Promise.resolve(200));

		expireCookie();
		expireCookie(COOKIE_DOMAIN);

		localStorage.clear();
	});

	afterEach(() => {
		AnalyticsClient.dispose();

		fetchMock.restore();

		jest.restoreAllMocks();
	});

	describe('when a cookie domain is configured', () => {
		const CONFIG = {...INITIAL_CONFIG, cookieDomain: COOKIE_DOMAIN};

		it('shares the id it already had on this host', () => {
			setItem(AnalyticsType.Keys.UserId, 'local-id');

			AnalyticsClient.create(CONFIG);

			expect(getUserIdCookies()).toEqual(['local-id']);

			expireHostOnlyCookie();

			expect(getUserIdCookies()).toEqual(['local-id']);
		});

		it('adopts the id already shared when it has none of its own', () => {
			setCookie('shared-id', COOKIE_DOMAIN);

			const analytics = AnalyticsClient.create(CONFIG);

			expect(getItem(AnalyticsType.Keys.UserId)).toBe('shared-id');
			expect(analytics._getUserId()).toBe('shared-id');
		});

		it('adopts the id when the domain is configured with a leading dot', () => {
			setCookie('shared-id', COOKIE_DOMAIN);

			AnalyticsClient.create({
				...CONFIG,
				cookieDomain: `.${COOKIE_DOMAIN}`,
			});

			expect(getItem(AnalyticsType.Keys.UserId)).toBe('shared-id');
		});

		it('keeps its own id and leaves the shared one untouched', () => {
			setCookie('shared-id', COOKIE_DOMAIN);
			setItem(AnalyticsType.Keys.UserId, 'local-id');

			AnalyticsClient.create(CONFIG);

			expect(getItem(AnalyticsType.Keys.UserId)).toBe('local-id');
			expect(getUserIdCookies()).toEqual(['shared-id']);
		});

		it('retires the cookie a previous version scoped to this host', () => {
			setCookie('legacy-id');
			setItem(AnalyticsType.Keys.UserId, 'legacy-id');

			AnalyticsClient.create(CONFIG);

			expect(getUserIdCookies()).toEqual(['legacy-id']);

			expireHostOnlyCookie();

			expect(getUserIdCookies()).toEqual(['legacy-id']);
		});

		it('does not adopt the shared id when the visitor is identified', () => {
			setCookie('shared-id', COOKIE_DOMAIN);

			const themeDisplay = window.Liferay.ThemeDisplay || {};

			themeDisplay.getUserEmailAddress = () => 'john@liferay.com';
			themeDisplay.getUserName = () => 'John';

			try {
				AnalyticsClient.create(CONFIG);

				expect(getItem(AnalyticsType.Keys.UserId)).not.toBe(
					'shared-id'
				);
				expect(getUserIdCookies()).toEqual(['shared-id']);
			}
			finally {
				delete themeDisplay.getUserEmailAddress;
				delete themeDisplay.getUserName;
			}
		});

		it('keeps the shared id when an identity change regenerates its own', async () => {
			fetchMock.mock(/identity$/, () => Promise.resolve(200));

			const analytics = AnalyticsClient.create(CONFIG);

			const [sharedUserId] = getUserIdCookies();

			await analytics.setIdentity({
				email: 'john@liferay.com',
				name: 'John',
			});

			await analytics.setIdentity({
				email: 'brian@liferay.com',
				name: 'Brian',
			});

			expect(getItem(AnalyticsType.Keys.UserId)).not.toBe(sharedUserId);
			expect(getUserIdCookies()).toEqual([sharedUserId]);
		});

		it('accepts a domain equal to the host it is serving', () => {

			// The server resolves liferay.com to liferay.com, so the site that
			// owns the registrable domain is handed its own host as the domain
			// to share at, and sharing has to stay on for it.
			//
			// Only the resolved domain is asserted, because jsdom keys a cookie
			// by its domain and path alone. A browser holds a host scoped and a
			// domain scoped cookie of the same name as two separate cookies
			// even when the domains are equal, and expires them independently,
			// while jsdom merges them into one. The cookie behavior for this
			// host shape is covered by test/manual/cookie-domain.html instead.

			const analytics = AnalyticsClient.create({
				...CONFIG,
				cookieDomain: window.location.hostname,
			});

			expect(analytics._getCookieDomain()).toBe(window.location.hostname);
		});

		it('writes the cookie at the shared domain through the Liferay API', () => {
			const cookieSet = jest.fn();

			window.Liferay.Util = {
				Cookie: {
					TYPES: {
						PERSONALIZATION: 'CONSENT_TYPE_PERSONALIZATION',
					},
					get: () => '',
					set: cookieSet,
				},
			};

			try {
				setItem(AnalyticsType.Keys.UserId, 'local-id');

				AnalyticsClient.create(CONFIG);

				expect(cookieSet).toHaveBeenCalledWith(
					AnalyticsType.Keys.UserId,
					'local-id',
					'CONSENT_TYPE_PERSONALIZATION',
					{
						domain: COOKIE_DOMAIN,
						expires: expect.any(Date),
						secure: true,
					}
				);
			}
			finally {
				delete window.Liferay.Util;
			}
		});
	});

	describe('when no cookie domain is configured', () => {
		it('keeps the cookie scoped to this host', () => {
			setItem(AnalyticsType.Keys.UserId, 'local-id');

			AnalyticsClient.create(INITIAL_CONFIG);

			expect(getUserIdCookies()).toEqual(['local-id']);

			expireHostOnlyCookie();

			expect(getUserIdCookies()).toEqual([]);
		});

		it('ignores an id already present in the cookie', () => {
			setCookie('shared-id', COOKIE_DOMAIN);

			AnalyticsClient.create(INITIAL_CONFIG);

			expect(getItem(AnalyticsType.Keys.UserId)).not.toBe('shared-id');
		});

		it.each(['example.com', '127.0.0.1', 'com'])(
			'ignores the cookie domain %s, which the browser would reject',
			(cookieDomain) => {
				setCookie('shared-id', COOKIE_DOMAIN);

				AnalyticsClient.create({...INITIAL_CONFIG, cookieDomain});

				expect(getItem(AnalyticsType.Keys.UserId)).not.toBe(
					'shared-id'
				);
			}
		);
	});
});
