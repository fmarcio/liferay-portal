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
import React from 'react';

const ButtonGroup = ({
	disableSecondaryButton,
	isSubmitButtonDisabled,
	onCancelClick,
	onSubmitClick,

	// primaryText = 'next',

	secondaryText = 'cancel',
}) => {
	return (
		<>
			<ClayButton.Group>
				<ClayButton
					block={isSubmitButtonDisabled}
					displayType="primary"
					onClick={onSubmitClick}
				>
					{Liferay.Language.get('connect')}
				</ClayButton>

				{!disableSecondaryButton && (
					<ClayButton displayType="secondary" onClick={onCancelClick}>
						{Liferay.Language.get(secondaryText)}
					</ClayButton>
				)}
			</ClayButton.Group>
		</>
	);
};

export default ButtonGroup;
