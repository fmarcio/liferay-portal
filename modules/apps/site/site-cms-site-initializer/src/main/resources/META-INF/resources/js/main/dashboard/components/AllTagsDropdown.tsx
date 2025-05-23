/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React, {useState} from 'react';

import ApiHelper from '../utils/ApiHelper';
import {buildQueryString} from '../utils/buildQueryString';
import {FilterDropdown} from './FilterDropdown';

import '../utils/liferay.d.ts';

type Tag = {
	label: string;
	value: string;
};

const initialTag = {
	label: Liferay.Language.get('all-tags'),
	value: 'all',
};

const PATH = '/o/headless-admin-taxonomy/v1.0/keywords';

window.Liferay.currentURL = () => window.location.pathname;

const AllTagsDropdown: React.FC<React.HTMLAttributes<HTMLElement>> = ({
	className,
}) => {
	const [tags, setTags] = useState<Tag[]>([initialTag]);

	const [tag, setTag] = useState<Tag>(initialTag);

	const [searchValue, setSearchValue] = useState('');
	const [loading, setLoading] = useState(false);

	const fetchTags = async (search: string = '') => {
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
			active={tag.value}
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
			onSelectItem={setTag}
			onTrigger={async () => {
				setLoading(true);

				const tags = await fetchTags();

				setTags([initialTag, ...tags]);

				setLoading(false);
			}}
			searchValue={searchValue}
			title={Liferay.Language.get('filter-by-tags').slice(0, -1)}
			triggerLabel={tag.label}
		/>
	);
};

export {AllTagsDropdown};
