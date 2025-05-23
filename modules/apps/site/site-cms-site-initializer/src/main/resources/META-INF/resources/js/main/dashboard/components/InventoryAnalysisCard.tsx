/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {ClayButtonWithIcon} from '@clayui/button';
import {Body, Cell, Head, Row, Table, Text} from '@clayui/core';
import {ClayPaginationBarWithBasicItems} from '@clayui/pagination-bar';
import React, {useState} from 'react';

import {AllCategoriesDropdown} from './AllCategoriesDropdown';
import {AllStructuresDropdown} from './AllStructuresDropdown';
import {AllTagsDropdown} from './AllTagsDropdown';
import {AllVocabulariesDropdown} from './AllVocabulariesDropdown';
import {BaseCard} from './BaseCard';
import {FilterDropdown} from './FilterDropdown';

const VolumeChart = ({
	percentage,
	volume,
}: {
	percentage: number;
	volume: number;
}) => {
	return (
		<div className="cms-dashboard__inventory-analysis__bar-chart">
			<div
				className="cms-dashboard__inventory-analysis__bar-chart__bar"
				style={{width: `${percentage}%`}}
			/>

			<div className="cms-dashboard__inventory-analysis__bar-chart__value">
				<Text size={3} weight="semi-bold">
					{volume}
				</Text>
			</div>
		</div>
	);
};

const structureTypes = [
	{
		label: Liferay.Language.get('structure-type'),
		value: 'all',
	},
	{
		label: Liferay.Language.get('structure-02'),
		value: 'structure02',
	},
];

type Data = {
	assets: {count: number; title: string}[];
	totalCount: number;
};

const mockData: Data = {
	assets: [
		{
			count: 999999,
			title: 'title 1',
		},
		{
			count: 999999,
			title: 'title 2',
		},
		{
			count: 999999,
			title: 'title 3',
		},
		{
			count: 999999,
			title: 'title 4',
		},
	],
	totalCount: 1000,
};

const mapData = (data: Data) => {
	return data.assets.map(({count, title}) => {
		const percentage = (count / data.totalCount) * 100;

		return {
			percentage,
			title,
			volume: <VolumeChart percentage={percentage} volume={count} />,
		};
	});
};

export function InventoryAnalysisCard() {
	const [structureTypeId, setStructureTypeId] = useState(
		structureTypes[0].value
	);

	const [delta, setDelta] = useState(4);

	const deltas = [
		{
			href: '#1',
			label: 1,
		},
		{
			label: 2,
		},
		{
			href: '#3',
			label: 3,
		},
		{
			label: 4,
		},
	];

	return (
		<div className="cms-dashboard__inventory-analysis">
			<BaseCard
				Preferences={
					<ClayButtonWithIcon
						aria-label={Liferay.Language.get('download')}
						borderless
						displayType="secondary"
						size="sm"
						symbol="download"
					/>
				}
				description={Liferay.Language.get(
					'this-report-provides-a-breakdown-of-total-assets-by-categorization,-structure-type,-or-space'
				)}
				title={Liferay.Language.get('inventory-analysis')}
			>
				<div className="align-items-center d-flex">
					<span className="mr-2">
						<Text size={3} weight="semi-bold">
							{Liferay.Language.get('group-by')}
						</Text>
					</span>

					<FilterDropdown
						active={structureTypeId}
						filterByValue="structureTypes"
						items={structureTypes}
						onSelectItem={(structureType) =>
							setStructureTypeId(structureType.value)
						}
						triggerLabel={
							structureTypes.find(
								({value}) => value === structureTypeId
							)?.label ?? ''
						}
					/>

					<span className="ml-3 mr-2">
						<Text size={3} weight="semi-bold">
							{Liferay.Language.get('filter-by')}
						</Text>
					</span>

					<AllStructuresDropdown />

					<AllVocabulariesDropdown />

					<AllCategoriesDropdown />

					<AllTagsDropdown />
				</div>

				<Table
					borderless
					columnsVisibility={false}
					hover={false}
					striped={false}
				>
					<Head
						items={[
							{
								id: 'title',
								name: Liferay.Language.get('structure-title'),
								width: '200px',
							},
							{
								id: 'volume',
								name: Liferay.Language.get('assets-volume'),
								width: 'calc(100% - 310px)',
							},
							{
								id: 'percentage',
								name: Liferay.Language.get('%-of-assets'),
								width: '110px',
							},
						]}
					>
						{(column) => (
							<Cell
								expanded={column.id === 'volume'}
								key={column.id}
								width={column.width}
							>
								{column.name}
							</Cell>
						)}
					</Head>

					<Body defaultItems={mapData(mockData)}>
						{(row) => (
							<Row>
								<Cell width="10%">
									<Text size={3} weight="semi-bold">
										{row['title']}
									</Text>
								</Cell>

								<Cell expanded width="80%">
									{row['volume']}
								</Cell>

								<Cell align="right" width="10%">
									{row['percentage']}
								</Cell>
							</Row>
						)}
					</Body>
				</Table>

				<ClayPaginationBarWithBasicItems
					activeDelta={delta}
					className="mt-3"
					defaultActive={1}
					deltas={deltas}
					ellipsisBuffer={3}
					ellipsisProps={{'aria-label': 'More', 'title': 'More'}}
					onDeltaChange={setDelta}
					totalItems={21}
				/>
			</BaseCard>
		</div>
	);
}
