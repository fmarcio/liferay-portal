/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

interface Window {
	Liferay: {
		FeatureFlags?: {
			[key: string]: boolean;
		};
		ThemeDisplay?: {
			getPathContext?: () => string;
			getUserEmailAddress?: () => string;
			getUserName?: () => string;
		};
		Util?: {
			Cookie?: {
				TYPES?: {
					[key: string]: string;
				};
				get?: (name: string) => string;
				set?: (
					key: string,
					data: string,
					type: any,
					options: {}
				) => void;
			};
			LocalStorage?: {
				TYPES?: {
					[key: string]: string;
				};
				getItem: (key: string, type: string) => void;
				removeItem: (key: string, type: string) => void;
				setItem: (key: string, value: any, type: string) => void;
			};
		};
	};
}

declare namespace Analytics {
	type Config = {
		channelId: string;
		dataSourceId: string;
		endpointUrl: string;
		flushInterval: number;
		identity: {
			emailAddressHashed: string;
		};
		identityEndpoint: string;
		projectId: string;
		userId: string;
	};

	type Event = {
		applicationId: string;
		contextHash: string;
		eventDate: string;
		eventId: string;
		eventLocalDate: string;
		properties: Analytics.EventProps;
	};

	type EventProps = {
		[key: string]: boolean | number | string;
	};

	type Identity = {
		channelId: string;
		dataSourceId: string;
		emailAddressHashed: string;
		id: string;
		userId: string;
	};

	// type Payload = (
	// 	| Analytics.Event
	// 	| Analytics.Identity
	// 	| Analytics.Message
	// ) & {
	// 	item?: {id: string};
	// };

	type Message = {
		channelId: string;
		context: {
			[key: string]: string;
		};
		dataSourceId: string;
		emailAddressHashed: string;
		events: Event[];
		id: string;
		userId: string;
	};

	type Middleware = {
		[key: string]: Function;
	};

	type Plugin = (analytics?: Analytics) => void;
}
