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
import ClayIcon from '@clayui/icon';
import ClayList from '@clayui/list';
import {useModal} from '@clayui/modal';
import React from 'react';

import BasePage from '../../components/BasePage';
import AccountsAttributesModal from '../../components/people-data-components/AccountsAttributesModal';
import OrderAttributsModal from '../../components/people-data-components/OrderAttributsModal';
import PeopleAttributesModal from '../../components/people-data-components/PeopleAttributesModal';
import ProductsAttributesModal from '../../components/people-data-components/ProductsAttributesModal';
import {TGenericComponent} from './WizardPage';

interface IStepProps extends TGenericComponent {}

const Step: React.FC<IStepProps> = () => {
	const {
		observer: observerPeopleAttributes,
		onOpenChange: onOpenChangePeopleAttributes,
		open: openPeopleAttributes,
	} = useModal();
	const {
		observer: observerAccountsAttributes,
		onOpenChange: onOpenChangeAccountsAttributes,
		open: openAccountsAttributes,
	} = useModal();
	const {
		observer: observerProductsAttributes,
		onOpenChange: onOpenChangeProductsAttributes,
		open: openProductsAttributes,
	} = useModal();
	const {
		observer: observerOrderAttributes,
		onOpenChange: onOpenChangeOrderAttributes,
		open: openOrderAttributes,
	} = useModal();

	const attributesList = [
		{
			count: 15,
			icon: 'users',
			onOpenModal: () => onOpenChangePeopleAttributes(true),
			title: Liferay.Language.get('people'),
		},
		{
			count: 3,
			icon: 'briefcase',
			onOpenModal: () => onOpenChangeAccountsAttributes(true),
			title: Liferay.Language.get('account'),
		},
		{
			count: 7,
			icon: 'categories',
			onOpenModal: () => onOpenChangeProductsAttributes(true),
			title: Liferay.Language.get('products'),
		},
		{
			count: 13,
			icon: 'shopping-cart',
			onOpenModal: () => onOpenChangeOrderAttributes(true),
			title: Liferay.Language.get('order'),
		},
	];

	return (
		<BasePage
			description={Liferay.Language.get('attributes-step-description')}
			title={Liferay.Language.get('attributes')}
		>
			{attributesList.map((item) => (
				<ClayList
					className="mb-0"
					key={item.title}
				>
					<ClayList.Item className="align-items-center" flex>
						<ClayList.ItemField className="mr-2">
							<ClayIcon symbol={item.icon} />
						</ClayList.ItemField>

						<ClayList.ItemField expand>
							<ClayList.ItemTitle>
								{item.title}
							</ClayList.ItemTitle>

							<ClayList.ItemText>
								{`${item.count} ${Liferay.Language.get(
									'selected'
								)}`}
							</ClayList.ItemText>
						</ClayList.ItemField>

						<ClayList.ItemField>
							<ClayButton
								displayType="secondary"
								onClick={item.onOpenModal}
							>
								{Liferay.Language.get('select-attributes')}
							</ClayButton>
						</ClayList.ItemField>
					</ClayList.Item>
				</ClayList>
			))}

			{openPeopleAttributes && (
				<PeopleAttributesModal
					observer={observerPeopleAttributes}
					onCloseModal={() => onOpenChangePeopleAttributes(false)}
				/>
			)}

			{openAccountsAttributes && (
				<AccountsAttributesModal
					observer={observerAccountsAttributes}
					onCloseModal={() => onOpenChangeAccountsAttributes(false)}
				/>
			)}

			{openProductsAttributes && (
				<ProductsAttributesModal
					observer={observerProductsAttributes}
					onCloseModal={() => onOpenChangeProductsAttributes(false)}
				/>
			)}

			{openOrderAttributes && (
				<OrderAttributsModal
					observer={observerOrderAttributes}
					onCloseModal={() => onOpenChangeOrderAttributes(false)}
				/>
			)}

			<BasePage.Footer>
				<ClayButton.Group spaced>
					<ClayButton onClick={() => alert('Salvou')}>
						{Liferay.Language.get('save-and-finish')}
					</ClayButton>

					<ClayButton
						displayType="secondary"
						onClick={() => window.location.reload()}
					>
						{Liferay.Language.get('cancel')}
					</ClayButton>
				</ClayButton.Group>
			</BasePage.Footer>
		</BasePage>
	);
};

export default Step;
