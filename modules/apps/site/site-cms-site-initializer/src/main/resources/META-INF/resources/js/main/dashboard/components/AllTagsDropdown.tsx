/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React, {useContext, useState} from 'react';

import ApiHelper from '../../../services/ApiHelper';
import {ViewDashboardContext} from '../ViewDashboardContext';
import {buildQueryString} from '../utils/buildQueryString';
import {FilterDropdown, Item} from './FilterDropdown';
import {IAllFiltersDropdown, initialTag} from './InventoryAnalysisCard';

const AllTagsDropdown: React.FC<IAllFiltersDropdown> = ({
	className,
	item,
	onSelectItem,
}) => {
	const {
		filters: {space},
	} = useContext(ViewDashboardContext);

	const [tags, setTags] = useState<Item[]>([initialTag]);

	const [searchValue, setSearchValue] = useState('');
	const [loading, setLoading] = useState(false);

	const fetchTags = async (search: string = '') => {
		const queryParams = buildQueryString({
			search,
		});

		const endpoint = `/o/headless-admin-taxonomy/v1.0/keywords${queryParams}`;

		const {data, error} = await ApiHelper.get<{
			items: {assetLibraries: {id: number}[]; id: string; name: string}[];
		}>(endpoint);

		if (data) {
			return data.items
				.filter(({assetLibraries}) => {
					if (space.value === 'all') {
						return true;
					}

					// Decreasing 1 on id due a bug on Objects

					return assetLibraries.some(
						({id}) => String(id - 1) === space.value
					);
				})
				.map(({id, name}) => ({
					label: name,
					value: String(id),
				}));
		}

		if (error) {
			console.error(error);
		}

		return [];
	};

	return (
		<FilterDropdown
			active={item.value}
			className={className}
			filterByValue="tags"
			icon="tag"
			items={tags}
			loading={loading}
			onSearch={async (value) => {
				setLoading(true);

				setSearchValue(value);

				const tags = await fetchTags(value);

				setTags(value ? tags : [initialTag, ...tags]);

				setLoading(false);
			}}
			onSelectItem={onSelectItem}
			onTrigger={async () => {
				setLoading(true);

				const tags = await fetchTags();

				setTags([initialTag, ...tags]);

				setLoading(false);
			}}
			searchValue={searchValue}
			title={Liferay.Language.get('filter-by-tags').slice(0, 1)}
			triggerLabel={item.label}
		/>
	);
};

export {AllTagsDropdown};
