/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayAlert from '@clayui/alert';
import ClayButton from '@clayui/button';
import {Text} from '@clayui/core';
import ClayLoadingIndicator from '@clayui/loading-indicator';
import ClayModal from '@clayui/modal';
import {FrontendDataSet} from '@liferay/frontend-data-set-web';
import {fetch, sub} from 'frontend-js-web';
import React, {useEffect, useMemo, useState} from 'react';

import {AssetUsageItem} from './AssetUsageItem';
import {
	Item,
	openDisplayUsagesModal,
	openMultipleAssetUsageModal,
	useFetchAssetDeletionOverview,
} from './utils';

import '../../../../css/components/MultipleAssetUsageModal.scss';

interface IMultipleAssetUsageModal {
	closeModal: () => void;
	itemsData: ItemData[];
	loadData?: () => {};
}

const MultipleAssetUsageModal: React.FC<IMultipleAssetUsageModal> = ({
	closeModal,
	itemsData,
	loadData,
}) => {
	const {data, loading} = useFetchAssetDeletionOverview(
		itemsData.map(({embedded: {id}}) => id)
	);

	const [selectedIds, setSelectedIds] = useState<number[]>(
		itemsData.map(({embedded: {id}}) => id)
	);

	const [alert, setAlert] = useState<{
		displayType: string;
		title: string;
	} | null>(null);

	useEffect(() => {
		if (!selectedIds.length) {
			setAlert({
				displayType: 'warning',
				title: Liferay.Language.get(
					'to-perform-this-action,-please-select-an-item-to-delete'
				),
			});
		}
		else {
			setAlert(null);
		}
	}, [selectedIds]);

	const itemsListUsingClassPK = useMemo(() => {
		if (!data?.items) {
			return [];
		}

		return data.items.map((item) => ({
			...item,
			id: item.classPK,
		}));
	}, [data]);

	if (!data) {
		return null;
	}

	const handleClickUsageItem = (item: Item) => {
		closeModal();

		openDisplayUsagesModal({
			item,
			onClose: () => openMultipleAssetUsageModal(itemsData, loadData),
		});
	};

	return (
		<>
			<ClayModal.Header>
				{sub(
					selectedIds.length === 1
						? Liferay.Language.get('delete-1-item')
						: Liferay.Language.get('delete-x-items'),
					selectedIds.length
				)}
			</ClayModal.Header>

			<ClayModal.Body>
				<div className="mb-3">
					<Text>
						{Liferay.Language.get(
							'some-items-are-being-used-in-other-assets-or-pages.-deleting-them-will-break-those-references-and-cause-broken-links-or-missing-content.-this-action-cannot-be-undone.-are-you-sure-you-want-to-continue'
						)}
					</Text>
				</div>

				{alert && (
					<ClayAlert
						displayType={alert.displayType as any}
						title={alert.title}
					/>
				)}

				{loading && <ClayLoadingIndicator />}

				{!loading && !!itemsListUsingClassPK.length && (
					<FrontendDataSet
						bulkActions={[{}]}
						id="delete-assets-list"
						items={itemsListUsingClassPK}
						onSelectedItemsChange={setSelectedIds}
						pagination={{initialDelta: 20}}
						selectedItems={selectedIds}
						selectedItemsKey="id"
						selectionType="multiple"
						showPagination
						views={[
							{
								contentRenderer: 'list',
								label: Liferay.Language.get('list'),
								name: 'list',
								schema: {
									description: 'asset-description',
									symbol: 'document',
									title: 'name',
									titleRenderer: {
										component: ({itemData}) => (
											<div
												className="d-flex"
												key={itemData.id}
											>
												<AssetUsageItem
													item={itemData as Item}
													onClick={() =>
														handleClickUsageItem(
															itemData as Item
														)
													}
												/>
											</div>
										),
									},
								},
								thumbnail: 'list',
							},
						]}
					/>
				)}
			</ClayModal.Body>

			<ClayModal.Footer
				last={
					<ClayButton.Group spaced>
						<ClayButton
							displayType="secondary"
							onClick={() => closeModal()}
						>
							{Liferay.Language.get('cancel')}
						</ClayButton>

						<ClayButton
							displayType="danger"
							onClick={async () => {
								if (!selectedIds.length) {
									setAlert({
										displayType: 'danger',
										title: Liferay.Language.get(
											'unable-to-perform-this-action,-please-select-an-item-to-delete'
										),
									});
								}
								else {
									setAlert(null);

									closeModal();

									const bulkActionItems = itemsData.map(
										(item) => ({
											classExternalReferenceCode:
												item.embedded
													.externalReferenceCode,
											className: item.entryClassName,
											classPK: item.embedded.id,
											name: item.embedded.title,
										})
									);

									await fetch(
										'/o/headless-cms/v1.0/bulk-action',
										{
											body: JSON.stringify({
												bulkActionItems,
												selectAll: false,
												type: 'DeleteBulkAction',
											}),
											headers: {
												'Accept': 'application/json',
												'Content-Type':
													'application/json',
												'x-csrf-token':
													Liferay.authToken,
											},
											method: 'POST',
										}
									);

									loadData?.();
								}
							}}
						>
							{Liferay.Language.get('delete')}
						</ClayButton>
					</ClayButton.Group>
				}
			/>
		</>
	);
};

export {MultipleAssetUsageModal};
