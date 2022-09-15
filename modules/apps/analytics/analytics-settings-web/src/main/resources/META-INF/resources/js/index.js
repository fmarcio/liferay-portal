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

import React, {useState} from 'react';

import {connectWorkspace} from './apis/data-source';
import ButtonGroup from './components/ButtonGroup';
import ConnectWorkspace from './components/ConnectWorkspace';
import MultiStepNav from './components/MultiStepNav';

const App = ({connected}) => {
	const [token, setToken] = useState();

	return (
		<>
			{!connected && (
				<>
					<MultiStepNav
						steps={[
							{
								content: (
									<ConnectWorkspace
										setToken={setToken}
										token={token}
									/>
								),
								description:
									'Use the token generated in your Analytics Cloud to connect this workspace.',
								footer: (
									<ButtonGroup
										disableSecondaryButton
										isSubmitButtonDisabled={!token}
										onSubmitClick={() =>
											connectWorkspace(token)
										}
									/>
								),
								title: 'Connect Analytics Cloud',
							},
						]}
					/>
				</>
			)}
		</>
	);
};

export default App;
