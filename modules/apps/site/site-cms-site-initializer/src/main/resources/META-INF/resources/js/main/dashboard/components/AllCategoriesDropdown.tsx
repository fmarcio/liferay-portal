/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React, {useState} from 'react';

import ApiHelper from '../utils/ApiHelper';
import {buildQueryString} from '../utils/buildQueryString';
import {FilterDropdown} from './FilterDropdown';

import '../utils/liferay.d.ts';

type Category = {
	label: string;
	value: string;
};

const initialCategory = {
	label: Liferay.Language.get('all-categories'),
	value: 'all',
};

Liferay.currentURL = () => window.location.pathname;

const PATH =
	'/o/headless-admin-taxonomy/v1.0/taxonomy-categories/0/taxonomy-categories';

const AllCategoriesDropdown: React.FC<React.HTMLAttributes<HTMLElement>> = ({
	className,
}) => {
	const [categories, setCategories] = useState<Category[]>([initialCategory]);

	const [category, setCategory] = useState<Category>(initialCategory);

	const [searchValue, setSearchValue] = useState('');
	const [loading, setLoading] = useState(false);

	const fetchCategories = async (search: string = '') => {
		const queryParams = buildQueryString({
			currentURL: Liferay.currentURL(),
			search,
		});

		const endpoint = `${PATH}${queryParams}`;

		const payload = await ApiHelper.get<{
			items: {id: string; name: string}[];
		}>(endpoint);

		return payload.items.map(({id, name}) => ({
			label: name,
			value: String(id),
		}));
	};

	return (
		<FilterDropdown
			active={category.value}
			className={className}
			filterByValue="categories"
			icon="categories"
			items={categories}
			loading={loading}
			onSearch={async (value) => {
				setLoading(true);

				setSearchValue(value);

				const categories = await fetchCategories(value);

				setCategories(
					value ? categories : [initialCategory, ...categories]
				);

				setLoading(false);
			}}
			onSelectItem={setCategory}
			onTrigger={async () => {
				setLoading(true);

				const categories = await fetchCategories();

				setCategories([initialCategory, ...categories]);

				setLoading(false);
			}}
			searchValue={searchValue}
			title={Liferay.Language.get('filter-by-category')}
			triggerLabel={category.label}
		/>
	);
};

export {AllCategoriesDropdown};
