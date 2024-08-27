/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {expect} from '@playwright/test';

export async function openDataControlAndPrivacyModal({
	modalDownloadButton,
	modalTitle,
	openModalButton,
	page,
}) {
	await page.getByRole('button', {name: openModalButton}).click();

	await expect(page.getByText(modalTitle)).toBeVisible();

	await expect(page.getByTestId('date-range-input')).toBeVisible();

	await expect(page.getByLabel('Choose Date Range')).toBeVisible();

	await expect(
		page.getByRole('button', {name: modalDownloadButton})
	).toBeVisible();
}
