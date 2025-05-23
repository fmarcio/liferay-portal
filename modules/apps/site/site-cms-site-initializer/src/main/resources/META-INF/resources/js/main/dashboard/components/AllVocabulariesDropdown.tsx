/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React, {useState} from 'react';

import ApiHelper from '../utils/ApiHelper';
import {buildQueryString} from '../utils/buildQueryString';
import {FilterDropdown} from './FilterDropdown';

import '../utils/liferay.d.ts';

const initialVocabulary = {
	label: Liferay.Language.get('all-vocabularies'),
	value: 'all',
};

type Vocabulary = {
	label: string;
	value: string;
};

const PATH = '/o/headless-admin-taxonomy/v1.0/taxonomy-vocabularies';

window.Liferay.currentURL = () => window.location.pathname;

const AllVocabulariesDropdown: React.FC<React.HTMLAttributes<HTMLElement>> = ({
	className,
}) => {
	const [vocabularies, setVocabularies] = useState<Vocabulary[]>([
		initialVocabulary,
	]);

	const [vocabulary, setVocabulary] = useState<Vocabulary>(initialVocabulary);

	const [searchValue, setSearchValue] = useState('');
	const [loading, setLoading] = useState(false);

	const fetchVocabularies = async (search: string = '') => {
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
			active={vocabulary.value}
			className={className}
			filterByValue="vocabularies"
			icon="vocabulary"
			items={vocabularies}
			loading={loading}
			onSearch={async (value) => {
				setLoading(true);

				setSearchValue(value);

				const vocabularies = await fetchVocabularies(value);

				setVocabularies(
					value ? vocabularies : [initialVocabulary, ...vocabularies]
				);

				setLoading(false);
			}}
			onSelectItem={setVocabulary}
			onTrigger={async () => {
				setLoading(true);

				const vocabularies = await fetchVocabularies();

				setVocabularies([initialVocabulary, ...vocabularies]);

				setLoading(false);
			}}
			searchValue={searchValue}
			title={Liferay.Language.get('filter-by-vocabulary')}
			triggerLabel={vocabulary.label}
		/>
	);
};

export {AllVocabulariesDropdown};
