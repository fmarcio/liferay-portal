/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React, {useContext, useState} from 'react';

import {ViewDashboardContext} from '../ViewDashboardContext';
import ApiHelper from '../utils/ApiHelper';
import {buildQueryString} from '../utils/buildQueryString';
import {FilterDropdown} from './FilterDropdown';

import '../utils/liferay.d.ts';

type Structure = {
	label: string;
	value: string;
};

const initialStructure = {
	label: Liferay.Language.get('all-structure'),
	value: 'all',
};

const PATH = '/o/object-admin/v1.0/object-definitions';

window.Liferay.currentURL = () => window.location.pathname;

const AllStructuresDropdown: React.FC<React.HTMLAttributes<HTMLElement>> = ({
	className,
}) => {
	const {constants} = useContext(ViewDashboardContext);

	const [structures, setStructures] = useState<Structure[]>([
		initialStructure,
	]);

	const [structure, setStructure] = useState<Structure>(initialStructure);

	const [searchValue, setSearchValue] = useState('');
	const [loading, setLoading] = useState(false);

	const fetchStructures = async (search: string = '') => {
		const queryParams = buildQueryString({
			currentURL: Liferay.currentURL(),
			filter: `(objectFolderExternalReferenceCode eq '${constants.ercContentStructures}' or objectFolderExternalReferenceCode eq '${constants.ercFileTypes}')`,
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
			active={structure.value}
			className={className}
			filterByValue="structures"
			icon="edit-layout"
			items={structures}
			loading={loading}
			onSearch={async (value) => {
				setLoading(true);

				setSearchValue(value);

				const structures = await fetchStructures(value);

				setStructures(
					value ? structures : [initialStructure, ...structures]
				);

				setLoading(false);
			}}
			onSelectItem={setStructure}
			onTrigger={async () => {
				setLoading(true);

				const structures = await fetchStructures();

				setStructures([initialStructure, ...structures]);

				setLoading(false);
			}}
			searchValue={searchValue}
			title={Liferay.Language.get('filter-by-structure-type')}
			triggerLabel={structure.label}
		/>
	);
};

export {AllStructuresDropdown};
