/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayModal from '@clayui/modal';
import {FrontendDataSet} from '@liferay/frontend-data-set-web';
import {sub} from 'frontend-js-web';
import React from 'react';

import {Item} from './utils';

interface IDisplayUsagesModal {
	item: Item;
}

const DisplayUsagesModal: React.FC<IDisplayUsagesModal> = ({item}) => {
	return (
		<>
			<ClayModal.Header>
				{sub(Liferay.Language.get('usages-of-x'), `"${item.name}"`)}
			</ClayModal.Header>

			<ClayModal.Body>
				<FrontendDataSet

					// apiURL={`/v1.0/asset-deletion-usages/${item.id}`}

					id="asset-usages-table"
					items={[]}
					showManagementBar
					showPagination
					showSearch
					sorts={[
						{
							active: true,
							default: true,
							direction: 'desc',
							label: 'name',
						},
					]}
					views={[
						{
							contentRenderer: 'table',
							default: true,
							label: Liferay.Language.get('table'),
							name: 'table',
							schema: {
								fields: [
									{
										fieldName: 'name',
										label: Liferay.Language.get('name'),
										sortable: true,
									},
									{
										fieldName: 'type',
										label: Liferay.Language.get('type'),
										sortable: false,
									},
								],
							},
							thumbnail: 'table',
						},
					]}
				/>
			</ClayModal.Body>
		</>
	);
};

export {DisplayUsagesModal};
