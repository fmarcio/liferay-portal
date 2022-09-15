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
import {openToast} from 'frontend-js-web';
import React, {useState} from 'react';

import {connectWorkspace} from './apis/data-source';
import ButtonGroup from './components/ButtonGroup';
import ConnectWorkspace from './components/ConnectWorkspace';
import MultiStepNav from './components/MultiStepNav';
import Sheet from './components/Sheet';

const App = () => {
	const [token, setToken] = useState('');

	const connected = false;

	return (
		<>
			{!connected && (
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
								Liferay.Language.get('use-the-token-genereted-in-your-analytics-cloud-to-connect-this-workspace'),
							footer: (
								<ButtonGroup
									disableSecondaryButton
									isSubmitButtonDisabled={!token}
									onSubmitClick={() => {
										connectWorkspace(token)
											.then(() =>
												openToast({
													message: Liferay.Language.get(
														'your-request-completed-successfully'
													),
													type: 'success',
												})
											)
											.catch(() =>
												openToast({
													message: Liferay.Language.get(
														'an-unexpected-error-occurred'
													),
													type: 'danger',
												})
											);
									}}
								/>
							),
							title: Liferay.Language.get('connect-analytics-cloud')
						},
					]}
				/>
			)}
			{connected && (
				<Sheet
					description={Liferay.Language.get('use-the-token-genereted-in-your-analytics-cloud-to-connect-this-workspace')}
					title={Liferay.Language.get('workspace-connection')}
				>
					<Sheet.Content>
						<ConnectWorkspace
							connected
							setToken={setToken}
							token={token}
						/>
					</Sheet.Content>

					<Sheet.Footer>
						<ClayButton
							className="mr-3"
							displayType="secondary"
							onClick={() => alert('Vai pra o workspace4')}
						>
							{Liferay.Language.get('go-to-workspace')}

							<ClayIcon className="ml-2" symbol="shortcut" />
						</ClayButton>

						<ClayButton
							displayType="secondary"
							onClick={() => alert('Desconecta hauhauahauhauhuusausuasuhaush')}
						>
							{Liferay.Language.get('disconnect')}
						</ClayButton>
					</Sheet.Footer>
				</Sheet>
			)}
		</>
	);
};

export default App;
