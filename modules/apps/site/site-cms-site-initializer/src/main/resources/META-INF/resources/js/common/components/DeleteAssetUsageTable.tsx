/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {FrontendDataSet} from '@liferay/frontend-data-set-web';
import React, {useEffect, useState} from 'react';

interface AssetDeletionUsage {
	name: String;
	type: String;
}

// Mock

const data: AssetDeletionUsage[] = [
	{name: 'AstraMedix Inc.', type: 'Page'},
	{name: 'AstraMedix Inc. (Draft)', type: 'Page'},
	{name: 'AstraMedix Inc.', type: 'Page Template'},
	{name: 'AstraMedix Inc. (Draft)', type: 'Page Template'},
	{name: 'AstraMedix Inc.', type: 'Display Page Template'},
	{name: 'AstraMedix Inc.', type: 'Web Content'},
	{name: 'AstraMedix Inc.', type: 'Web Content'},
	{name: 'AstraMedix Inc.', type: 'Web Content'},
];

const AssetUsageTable = () => {
	const [items, setItems] = useState<AssetDeletionUsage[]>([]);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {

		// Mock do fetch para saber onde o asset está sendo usado

		const fetchUsagesData = async () => {
			setLoading(true);

			try {
				setItems(data);
			}
			catch (error) {
				console.error(error);
			}
			finally {
				setLoading(false);
			}
		};

		fetchUsagesData();
	}, []);

	return (
		<FrontendDataSet
			id="asset-usages-table"
			items={items}
			pagination={{initialDelta: 10}}
			showManagementBar={true}
			showPagination={true}
			showSearch={true}
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
	);
};

export {AssetUsageTable};
