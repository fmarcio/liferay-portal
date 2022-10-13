/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

import {ClayCheckbox} from '@clayui/form';
import ClayTable from '@clayui/table';
import React, {useState} from 'react';

import TabsTemplate from './TabsTemplate';

interface ISiteTab {
	description?: string;
}

const mockedData = [
	{
		checked: true,
		id: '1',
		name: 'beryl 1',
		property: 'property 1',
		relatedSite: 'site 1',
	},
	{
		checked: false,
		id: '2',
		name: 'beryl 2',
		property: 'property 2',
		relatedSite: 'site 2',
	},
	{
		checked: false,
		id: '3',
		name: 'beryl 3',
		property: 'property 3',
		relatedSite: 'site 3',
	},
	{
		checked: true,
		id: '4',
		name: 'beryl 4',
		property: 'property 4',
		relatedSite: 'site 4',
	},
];

const SitesTab: React.FC<ISiteTab> = () => {
	const [items, setItems] = useState(mockedData);

	const handleCheckboxChange = (event: any) => {
		const newItems = items.map((item) => {
			if (item.id === event.target.id) {
				return {
					...item,
					checked: event.target.checked,
				};
			}

			return item;
		});
		setItems(newItems);
	};

	return (
		<TabsTemplate data={mockedData} siteTab>
			<ClayTable>
				<ClayTable.Head>
					<ClayTable.Row>
						<ClayTable.Cell className="w-auto"></ClayTable.Cell>

						<ClayTable.Cell headingCell>Site Name</ClayTable.Cell>

						<ClayTable.Cell headingCell>Frendly URL</ClayTable.Cell>

						<ClayTable.Cell expanded headingCell>
							Assigned Property
						</ClayTable.Cell>
					</ClayTable.Row>
				</ClayTable.Head>

				<ClayTable.Body>
					{items &&
						items.map(
							({checked, id, name, property, relatedSite}) => (
								<ClayTable.Row key={id}>
									<ClayTable.Cell>
										<ClayCheckbox
											checked={checked}
											id={id}
											onChange={handleCheckboxChange}
										/>
									</ClayTable.Cell>

									<ClayTable.Cell>{name}</ClayTable.Cell>

									<ClayTable.Cell>
										{relatedSite}
									</ClayTable.Cell>

									<ClayTable.Cell>{property}</ClayTable.Cell>
								</ClayTable.Row>
							)
						)}
				</ClayTable.Body>
			</ClayTable>
		</TabsTemplate>
	);
};

export default SitesTab;
