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

import ClayButton from '@clayui/button';
import ClayModal from '@clayui/modal';
import ClayTabs from '@clayui/tabs';
import React, {useState} from 'react';

interface IPeopleAttributesModalProps {
	observer: any;
	onCloseModal: () => void;
}

export enum ETabs {
	Contact = 0,
	Users = 1,
}

const PeopleAttributesModal: React.FC<IPeopleAttributesModalProps> = ({
	observer,
	onCloseModal,
}) => {
	const [activeTabKeyValue, setActiveTabKeyValue] = useState<ETabs>(
		ETabs.Contact
	);

	return (
		<ClayModal center observer={observer} size="lg">
			<ClayModal.Header>
				{Liferay.Language.get('sync-people-attributes')}
			</ClayModal.Header>

			<ClayModal.Subtitle className="mx-4 my-2 text-secondary">
				{Liferay.Language.get('sync-data-fields-help')}
			</ClayModal.Subtitle>

			<ClayModal.Body>
				<ClayTabs modern>
					<ClayTabs.Item
						active={activeTabKeyValue === ETabs.Contact}
						innerProps={{
							'aria-controls': 'tabpanel-1',
						}}
						onClick={() => setActiveTabKeyValue(ETabs.Contact)}
					>
						{Liferay.Language.get('contact')}
					</ClayTabs.Item>

					<ClayTabs.Item
						active={activeTabKeyValue === ETabs.Users}
						innerProps={{
							'aria-controls': 'tabpanel-2',
						}}
						onClick={() => setActiveTabKeyValue(ETabs.Users)}
					>
						{Liferay.Language.get('users')}
					</ClayTabs.Item>
				</ClayTabs>

				<ClayTabs.Content activeIndex={activeTabKeyValue} fade>
					<ClayTabs.TabPane aria-labelledby="tab-1">
						Add Compose Table
					</ClayTabs.TabPane>

					<ClayTabs.TabPane aria-labelledby="tab-2">
						Add Compose Table
					</ClayTabs.TabPane>
				</ClayTabs.Content>
			</ClayModal.Body>

			<ClayModal.Footer
				last={
					<ClayButton.Group spaced>
						<ClayButton
							displayType="secondary"
							onClick={() => onCloseModal()}
						>
							{Liferay.Language.get('cancel')}
						</ClayButton>

						<ClayButton displayType="primary" onClick={() => {}}>
							{Liferay.Language.get('sync')}
						</ClayButton>
					</ClayButton.Group>
				}
			/>
		</ClayModal>
	);
};

export default PeopleAttributesModal;
