/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {mergeTests} from '@playwright/test';

import {apiHelpersTest} from '../../fixtures/apiHelpersTest';
import {dataApiHelpersTest} from '../../fixtures/dataApiHelpersTest';
import {featureFlagsTest} from '../../fixtures/featureFlagsTest';
import {loginAnalyticsCloudTest} from '../../fixtures/loginAnalyticsCloudTest';
import {loginTest} from '../../fixtures/loginTest';
import getRandomString from '../../utils/getRandomString';
import {createChannel} from './utils/channel';
import {openDataControlAndPrivacyModal} from './utils/data-control-and-privacy';
import {ACPage, navigateTo, navigateToACPageViaURL} from './utils/navigation';

export const test = mergeTests(
	apiHelpersTest,
	dataApiHelpersTest,
	featureFlagsTest({
		'LPS-178052': true,
	}),
	loginAnalyticsCloudTest(),
	loginTest()
);

test(
	'Verify that Request Log and Suppressed Users export buttons are opening its modals when clicked',

	{
		tag: '@LPD-34707 and LPD-34709',
	},

	async ({apiHelpers, page}) => {
		const channelName = 'My Property - ' + getRandomString();

		const {channel, project} = await createChannel({
			apiHelpers,
			channelName,
		});

		await test.step('Go to Analytics Cloud and Switch the property', async () => {
			await navigateToACPageViaURL({
				acPage: ACPage.sitePage,
				channelID: channel.id,
				page,
				projectID: project.groupId,
			});
		});

		await test.step('Go to Settings page and click on Data Control & Privacy section', async () => {
			await navigateTo({page, pageName: 'Settings'});

			await navigateTo({page, pageName: 'Data Control & Privacy'});
		});

		await test.step('Cick on Export Log button and check if modal is opening correctly', async () => {
			openDataControlAndPrivacyModal({
				modalDownloadButton: 'Download',
				modalTitle: 'Export Request Log',
				openModalButton: 'Export Log',
				page,
			});
		});

		await page.getByLabel('Close').click();

		await test.step('Cick on Export List button and check if modal is opening correctly', async () => {
			openDataControlAndPrivacyModal({
				modalDownloadButton: 'Download',
				modalTitle: 'Export Suppression List',
				openModalButton: 'Export List',
				page,
			});
		});

		await page.getByLabel('Close').click();

		await test.step('delete channel', async () => {
			await apiHelpers.jsonWebServicesOSBFaro.deleteChannel(
				`[${channel.id}]`,
				project.groupId
			);
		});
	}
);
