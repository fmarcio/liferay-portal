/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import {Text} from '@clayui/core';
import ClayList from '@clayui/list';
import ClayLoadingIndicator from '@clayui/loading-indicator';
import ClayModal from '@clayui/modal';
import {sub} from 'frontend-js-web';
import React from 'react';

import deleteItemAction from '../../../main_view/props_transformer/actions/deleteItemAction';
import {AssetUsageItem} from './AssetUsageItem';
import {
	openAssetUsageModal,
	openDisplayUsagesModal,
	useFetchAssetDeletionOverview,
} from './utils';

interface IDeleteSingleAsset {
	closeModal: () => void;
	itemData: ItemData;
	loadData?: () => {};
}

const AssetUsageModal: React.FC<IDeleteSingleAsset> = ({
	closeModal,
	itemData,
	loadData,
}) => {
	const {data, loading} = useFetchAssetDeletionOverview([
		itemData.embedded.id,
	]);

	if (!data) {
		return null;
	}

	const handleClickUsageItem = () => {
		closeModal();

		openDisplayUsagesModal({
			item: data.items[0],
			onClose: () => {
				closeModal();

				openAssetUsageModal(itemData, loadData);
			},
		});
	};

	return (
		<>
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

				{loading && <ClayLoadingIndicator />}

				{!loading && !!data.items.length && (
					<ClayList>
						<ClayList.Item flex>
							<AssetUsageItem
								item={data.items[0]}
								onClick={handleClickUsageItem}
							/>
						</ClayList.Item>
					</ClayList>
				)}
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
		</>
	);
};

export {AssetUsageModal};
