/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {ClayButtonWithIcon} from '@clayui/button';
import ClayLabel from '@clayui/label';
import ClayList from '@clayui/list';
import {sub} from 'frontend-js-web';
import React from 'react';

import {AssetIcon, MimeTypes} from '../AssetIcon';
import {Item} from './utils';

interface IAssetUsageItemProps {
	item: Item;
	onClick: () => void;
}

const AssetUsageItem: React.FC<IAssetUsageItemProps> = ({item, onClick}) => {
	const {name} = item;
	const {deletionType, mimeType, usages} = item.attributes;

	return (
		<>
			<ClayList.ItemField>
				<AssetIcon mimeType={mimeType as MimeTypes} />
			</ClayList.ItemField>

			<ClayList.ItemField expand>
				<ClayList.ItemTitle>{name}</ClayList.ItemTitle>

				<ClayList.ItemText>
					{sub(Liferay.Language.get('x-usages'), [usages])}
				</ClayList.ItemText>

				<ClayList.ItemText>
					<ClayLabel
						displayType={
							deletionType === 'PERMANENT_DELETION'
								? 'danger'
								: 'secondary'
						}
					>
						{deletionType === 'PERMANENT_DELETION'
							? Liferay.Language.get('permanent-deletion')
							: Liferay.Language.get('recycle-bin')}
					</ClayLabel>
				</ClayList.ItemText>
			</ClayList.ItemField>

			<ClayList.ItemField>
				<ClayButtonWithIcon
					aria-label={Liferay.Language.get('view-usages')}
					className="border-0"
					data-testid="view-usages-button"
					data-tooltip-align="top"

					// disabled={itemData.usages === 0}

					displayType="secondary"
					onClick={onClick}
					symbol="list-ul"
					title={Liferay.Language.get('view-usages')}
				/>
			</ClayList.ItemField>
		</>
	);
};

export {AssetUsageItem};
