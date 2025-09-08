/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton, {ClayButtonWithIcon} from '@clayui/button';
import {Text} from '@clayui/core';
import ClayIcon from '@clayui/icon';
import Label from '@clayui/label';
import List from '@clayui/list';
import ClayLoadingIndicator from '@clayui/loading-indicator';
import ClayModal from '@clayui/modal';
import {ClayTooltipProvider} from '@clayui/tooltip';
import {openModal} from 'frontend-js-components-web';
import {sub} from 'frontend-js-web';
import React, {useEffect, useState} from 'react';

import {openDeleteAssetModal} from '../../main_view/modal/DeleteAssetModal';
import deleteItemAction from '../../main_view/props_transformer/actions/deleteItemAction';
import ApiHelper from '../services/ApiHelper';
import {AssetUsageTable} from './DeleteAssetUsageTable';

type AssetDeletionItem = {
	deletionType: 'PERMANENT_DELETION' | 'RECYCLE_BIN';
	id: number;
	mimeType: string;
	title: string;
	usages: number;
};

type AssetDeletionOverview = {
	actions: Record<string, unknown>;
	facets: unknown[];
	items: AssetDeletionItem[];
	lastPage: number;
	page: number;
	pageSize: number;
	totalCount: number;
};

export interface AssetUsageListProps {
	closeModal: () => void;
	itemData: ItemData;
	loadData: () => {};
}

const AssetUsageList: React.FC<AssetUsageListProps> = ({
	closeModal,
	itemData,
	loadData,
}) => {
	const [item, setItem] = useState<AssetDeletionItem>();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUsageAssetData = async () => {
			const endpoint = `/o/analytics-cms-rest/v1.0/asset-deletion-overviews?assetIds=${itemData.embedded.id}`;

			const {data, error} =
				await ApiHelper.get<AssetDeletionOverview>(endpoint);

			if (error) {
				console.error(error);
			}

			if (data?.items.length) {
				setItem(data.items[0]);
			}

			setLoading(false);
		};

		fetchUsageAssetData();
	}, [itemData]);

	if (loading) {
		return <ClayLoadingIndicator />;
	}

	if (!item) {
		return null;
	}

	return (
		<ClayTooltipProvider>
			<div>
				<ClayModal.Header>
					{sub(
						Liferay.Language.get('delete-x'),
						`"${itemData.embedded.title}"`
					)}
				</ClayModal.Header>

				<ClayModal.Body>
					<div className="mb-3">
						<Text>
							{Liferay.Language.get(
								'this-item-is-being-used-in-other-assets-or-pages-deleting-it-will-break-those-references-and-cause-broken-links-or-missing-content-this-action-cannot-be-undone-are-you-sure-you-want-to-continue'
							)}
						</Text>
					</div>

					<List>
						<List.Item flex>
							<List.ItemField>
								<ClayIcon
									className="mt-1"
									symbol="document-default"
								/>
							</List.ItemField>

							<List.ItemField expand>
								<List.ItemTitle>
									{itemData.embedded.title}
								</List.ItemTitle>

								<List.ItemText>
									{sub(Liferay.Language.get('x-usages'), [
										item.usages,
									])}
								</List.ItemText>

								<List.ItemText>
									<Label
										displayType={
											item.deletionType ===
											'PERMANENT_DELETION'
												? 'danger'
												: 'secondary'
										}
									>
										{item.deletionType ===
										'PERMANENT_DELETION'
											? Liferay.Language.get(
													'permanent-deletion'
												)
											: Liferay.Language.get(
													'recycle-bin'
												)}
									</Label>
								</List.ItemText>
							</List.ItemField>

							<List.ItemField>
								<ClayButtonWithIcon
									aria-label={Liferay.Language.get(
										'view-usages'
									)}
									className="border-0"
									data-testid="view-usages-button"
									data-tooltip-align="top"
									disabled={item.usages === 0}
									displayType="secondary"
									onClick={() => {
										closeModal();
										openModal({
											bodyComponent: AssetUsageTable,
											onClose: () => {
												openDeleteAssetModal(
													itemData,
													loadData
												);
											},
											size: 'lg',
											title: sub(
												Liferay.Language.get(
													'usages-of-x'
												),
												`"${itemData.embedded.title}"`
											),
										});
									}}
									symbol="list-ul"
									title={Liferay.Language.get('view-usages')}
								/>
							</List.ItemField>
						</List.Item>
					</List>
				</ClayModal.Body>

				<ClayModal.Footer
					last={
						<ClayButton.Group spaced>
							<ClayButton
								displayType="secondary"
								onClick={closeModal}
							>
								{Liferay.Language.get('cancel')}
							</ClayButton>

							<ClayButton
								displayType="danger"
								onClick={() => {
									closeModal();
									deleteItemAction(itemData, loadData);
								}}
							>
								{Liferay.Language.get('delete-asset')}
							</ClayButton>
						</ClayButton.Group>
					}
				/>
			</div>
		</ClayTooltipProvider>
	);
};

export {AssetUsageList};
