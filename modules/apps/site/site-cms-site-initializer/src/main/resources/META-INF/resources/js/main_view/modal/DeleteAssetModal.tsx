/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {openModal} from 'frontend-js-components-web';
import React from 'react';

import {AssetUsageList} from '../../common/components/DeleteAssetUsageList';

const openDeleteAssetModal = (itemData: ItemData, loadData: () => {}) => {
	openModal({
		contentComponent: ({closeModal}: {closeModal: () => void}) =>
			AssetUsageList({
				closeModal,
				itemData,
				loadData,
			}) as React.JSX.Element,
		size: 'lg',
		status: 'danger',
	});
};

export {openDeleteAssetModal};
