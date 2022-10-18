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

import ClayButton, {ClayButtonWithIcon} from '@clayui/button';
import {Text} from '@clayui/core';
import {ClayDropDownWithItems} from '@clayui/drop-down';
import {ClayCheckbox, ClayInput} from '@clayui/form';
import ClayIcon from '@clayui/icon';
import ClayManagementToolbar from '@clayui/management-toolbar';
import {ClayPaginationBarWithBasicItems} from '@clayui/pagination-bar';
import React, {useState} from 'react';

interface ITabsTemplate {
	channelTab?: any;
	children: any;
	data: any;
	siteTab?: any;
}

const TabsTemplate: React.FC<ITabsTemplate> = ({
	channelTab,
	children,
	data,
	siteTab,
}) => {
	const [searchMobile, setSearchMobile] = useState(false);
	const [checked, setChecked] = useState(false);
	const [delta, setDelta] = useState(5);

	const filterItems = [
		{
			label: Liferay.Language.get('channel-name'),
			onClick: () => alert('Filter clicked'),
		},
		{
			label: Liferay.Language.get('related-site'),
			onClick: () => alert('Filter clicked'),
		},
		{
			label: Liferay.Language.get('assigned-property'),
			onClick: () => alert('Filter clicked'),
		},
	];

	const handleSelectAll = () => {

		// TODO: update this function with COMMERCE endpoint when LRAC-12088 is on master

		setChecked(!checked);
	};

	return (
		<>
			<div className="mt-3">
				<Text as="p" color="secondary" size={3}>
					{channelTab &&
						'CHANNELS can only be assigned to a single property at a time. Sites belonging to a channel will be automatically selected when a channel has been selected.'}

					{siteTab &&
						'Sites can only be assigned to a single property at a time. All desired sites must be selected individually, including those that have a child relationships to parent sites. Sites belonging to a channel are required until the channel is deselected.'}
				</Text>
			</div>

			<ClayManagementToolbar>
				<ClayManagementToolbar.ItemList>
					<ClayManagementToolbar.Item>
						{/* TODO: include request to backend on onChange event when BE endpoint is done */}

						<ClayCheckbox
							checked={checked}
							onChange={handleSelectAll}
						/>
					</ClayManagementToolbar.Item>

					<ClayDropDownWithItems
						items={filterItems}
						trigger={
							<ClayButton
								className="nav-link"
								displayType="unstyled"
							>
								<span className="navbar-breakpoint-down-d-none">
									<span className="navbar-text-truncate">
										Order
									</span>

									<ClayIcon
										className="inline-item inline-item-after"
										symbol="caret-bottom"
									/>
								</span>

								<span className="navbar-breakpoint-d-none">
									<ClayIcon symbol="filter" />
								</span>
							</ClayButton>
						}
					/>

					<ClayManagementToolbar.Item>
						<ClayButton
							className="nav-link nav-link-monospaced"
							displayType="unstyled"
							onClick={() => {}}
						>
							<ClayIcon symbol="order-arrow" />
						</ClayButton>
					</ClayManagementToolbar.Item>
				</ClayManagementToolbar.ItemList>

				{/* // TODO: update this component with function to handle the search component (filter results). 
				// The function will be created on another story (LRAC-12019) */}

				<ClayManagementToolbar.Search showMobile={searchMobile}>
					<ClayInput.Group>
						<ClayInput.GroupItem>
							<ClayInput
								aria-label="Search"
								className="form-control input-group-inset input-group-inset-after"
								placeholder="Search"
								type="text"
							/>

							<ClayInput.GroupInsetItem after tag="span">
								<ClayButtonWithIcon
									className="navbar-breakpoint-d-none"
									displayType="unstyled"
									onClick={() => setSearchMobile(false)}
									symbol="times"
								/>

								<ClayButtonWithIcon
									displayType="unstyled"
									symbol="search"
									type="submit"
								/>
							</ClayInput.GroupInsetItem>
						</ClayInput.GroupItem>
					</ClayInput.Group>
				</ClayManagementToolbar.Search>

				<ClayManagementToolbar.ItemList>
					<ClayManagementToolbar.Item className="navbar-breakpoint-d-none">
						<ClayButton
							className="nav-link nav-link-monospaced"
							displayType="unstyled"
							onClick={() => setSearchMobile(true)}
						>
							<ClayIcon symbol="search" />
						</ClayButton>
					</ClayManagementToolbar.Item>
				</ClayManagementToolbar.ItemList>
			</ClayManagementToolbar>

			{children}

			{/* // TODO: update this component with function to handle the pagination component. 
			// The function will be created on another story (LRAC-12019) */}

			<ClayPaginationBarWithBasicItems
				activeDelta={delta}
				defaultActive={1}
				deltas={[4, 8, 20, 40, 60].map((size) => ({
					label: size,
				}))}
				onDeltaChange={setDelta}
				totalItems={data.length}
			/>
		</>
	);
};

export default TabsTemplate;
