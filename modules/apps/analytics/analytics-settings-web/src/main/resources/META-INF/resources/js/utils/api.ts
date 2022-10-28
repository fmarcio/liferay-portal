/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

import {fetch} from 'frontend-js-web';

export function fetchAccountGroups() {
	return fetch('/o/analytics-settings-rest/v1.0/contacts/account-groups', {
		method: 'GET',
	})
		.then((response) => response.json())
		.then((data) => data);
}

export function fetchConnection(token: string) {
	return fetch('/o/analytics-settings-rest/v1.0/data-sources', {
		body: JSON.stringify({
			token,
		}),
		headers: {'Content-Type': 'application/json'},
		method: 'POST',
	});
}

export function fetchContactsOrganization() {
	return fetch('o/analytics-settings-rest/v1.0/contacts/organizations', {
		method: 'GET',
	})
		.then((response) => response.json())
		.then((data) => data);
}

export function fetchContactsUsersGroup() {
	return fetch('/o/analytics-settings-rest/v1.0/contacts/user-groups', {
		method: 'GET',
	})
		.then((response) => response.json())
		.then((data) => data);
}

export function deleteConnection() {
	return fetch('/o/analytics-settings-rest/v1.0/data-sources', {
		method: 'DELETE',
	});
}

export function fetchPeopleData() {
	return fetch('/o/analytics-settings-rest/v1.0/contacts/configuration', {
		method: 'GET',
	})
		.then((response) => response.json())
		.then((data) => data);
}

export function fetchProperties() {
	return fetch('/o/analytics-settings-rest/v1.0/channels', {
		method: 'GET',
	})
		.then((response) => response.json())
		.then((data) => data);
}

export function createProperty(name: string) {
	return fetch('/o/analytics-settings-rest/v1.0/channels', {
		body: JSON.stringify({
			name,
		}),
		headers: {'Content-Type': 'application/json'},
		method: 'POST',
	});
}

export function updatePeopleData(
	syncAllAccounts: boolean,
	syncAllContacts: boolean,
	syncedAccountGroupIds: string[],
	syncedOrganizationIds: string[],
	syncedUserGroupIds: string[]
) {
	return fetch('/o/analytics-settings-rest/v1.0/contacts/configuration', {
		body: JSON.stringify({
			syncAllAccounts,
			syncAllContacts,
			syncedAccountGroupIds,
			syncedOrganizationIds,
			syncedUserGroupIds,
		}),
		headers: {'Content-Type': 'application/json'},
		method: 'PUT',
	});
}
