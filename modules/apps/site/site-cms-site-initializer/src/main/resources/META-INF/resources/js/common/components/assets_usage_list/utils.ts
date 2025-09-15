/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {openModal} from 'frontend-js-components-web';
import {useEffect, useState} from 'react';

import ApiHelper from '../../services/ApiHelper';
import {AssetUsageModal} from './AssetUsageModal';
import {DisplayUsagesModal} from './DisplayUsagesModal';
import {MultipleAssetUsageModal} from './MultipleAssetUsageModal';

export type Item = {
	attributes: {
		deletionType: string;
		mimeType: string;
		type: string;
		usages: number;
	};
	className: string;
	classPK: number;
	externalReferenceCode: string;
	name: string;
};

export type AssetDeletionOverviewResponse = {
	items: Item[];
	lastPage: number;
	page: number;
	pageSize: number;
	totalCount: number;
};

const useFetchAssetDeletionOverview = (ids: number[]) => {
	const [data, setData] = useState<AssetDeletionOverviewResponse | null>(
		null
	);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUsageAssetData = async () => {
			const {data, error} =
				await ApiHelper.get<AssetDeletionOverviewResponse>(
					`/o/headless-cms/v1.0/bulk-action-delete/preview?assetIds=${ids}`
				);

			if (error) {
				console.error(error);
			}

			if (data) {
				setData(data);
			}

			setLoading(false);
		};

		fetchUsageAssetData();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [JSON.stringify(ids)]);

	return {data, loading};
};

const openAssetUsageModal = (itemData: ItemData, loadData?: () => {}) => {
	openModal({
		contentComponent: ({closeModal}: {closeModal: () => void}) =>
			AssetUsageModal({
				closeModal,
				itemData,
				loadData,
			}) as React.JSX.Element,
		size: 'lg',
		status: 'danger',
	});
};

const openMultipleAssetUsageModal = (
	itemsData: ItemData[],
	loadData?: () => {}
) => {
	openModal({
		contentComponent: ({closeModal}: {closeModal: () => void}) =>
			MultipleAssetUsageModal({
				closeModal,
				itemsData,
				loadData,
			}) as React.JSX.Element,
		size: 'lg',
		status: 'danger',
	});
};

const openDisplayUsagesModal = ({
	item,
	onClose,
}: {
	item: Item;
	onClose: () => void;
}) => {
	openModal({
		contentComponent: () =>
			DisplayUsagesModal({
				item,
			}) as React.JSX.Element,
		onClose,
		size: 'lg',
	});
};

export {
	openAssetUsageModal,
	openDisplayUsagesModal,
	openMultipleAssetUsageModal,
	useFetchAssetDeletionOverview,
};
