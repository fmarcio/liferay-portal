import ClayButton from '@clayui/button';
import ClayIcon from '@clayui/icon';
import ClayLink from '@clayui/link';
import Clipboard from 'clipboard';
import getCN from 'classnames';
import React, {useCallback, useEffect, useState} from 'react';
import {Alert} from 'shared/types';
import {ClayInput} from '@clayui/form';
import {noop} from 'lodash';
import {Text} from '@clayui/core';

interface IReconnectSalesforceProps {
	addAlert: (alert) => void;
}
const ANALYTICS_URL = 'https://analytics.liferay.com';

const ReconnectSalesforce: React.FC<IReconnectSalesforceProps> = ({
	addAlert
}) => {
	const [consumerKeyClientId, setConsumerKeyClientId] = useState<string>('');
	const [
		consumerSecretClientSecret,
		setConsumerSecretClientSecret
	] = useState<string>('');

	const [copyTitle, setCopyTitle] = useState(
		Liferay.Language.get('click-to-copy')
	);
	const [isUrlCopied, setIsUrlCopied] = useState<boolean>(false);
	const [salesforceDataSource, setSalesforceDataSource] = useState<string>(
		''
	);

	useEffect(() => {
		const clipboardId = '[data-clipboard-text]';

		const _clipboard = new Clipboard(clipboardId);

		_clipboard.on('success', event => {
			setCopyTitle(Liferay.Language.get('copied'));
			event.clearSelection();
		});

		return () => _clipboard.destroy();
	}, []);

	const handleCopyTargetUrl = useCallback(() => {
		setIsUrlCopied(true);

		addAlert({
			alertType: Alert.Types.Success,
			message: Liferay.Language.get('copied-link-to-the-clipboard')
		});
	}, [addAlert]);

	return (
		<>
			<Text color='secondary' size={4}>
				{Liferay.Language.get(
					'to-reestablish-the-connection-between-salesforce-and-liferay-analytics-cloud,-generate-a-token-and-paste-the-code-on-the-input-below'
				)}
			</Text>

			<ClayLink
				className='ml-1'
				href=''
				key='DOCUMENTATION'
				target='_blank'
			>
				{Liferay.Language.get('learn-more-about-data-sources')}
			</ClayLink>

			<ClayInput.Group className='d-flex flex-column mt-3'>
				<ClayInput.GroupItem className='ml-0 w-100'>
					<label htmlFor='targetUrl'>
						{Liferay.Language.get('target-url')}
					</label>
				</ClayInput.GroupItem>

				<span className='mb-1'>
					<Text color='secondary' size={3}>
						{Liferay.Language.get(
							'this-is-analytics-cloud-callback-url-salesforce-will-redirect-to-after-a-user-authorizes-the-connection'
						)}
					</Text>
				</span>

				<ClayInput.Group className={getCN('mb-3 ml-0 w-100')}>
					<ClayInput.GroupItem prepend>
						<ClayInput
							onChange={noop}
							readOnly
							type='text'
							value={ANALYTICS_URL}
						/>
					</ClayInput.GroupItem>
					<ClayInput.GroupItem append shrink>
						<ClayButton
							aria-label={Liferay.Language.get('copy')}
							data-clipboard-text={ANALYTICS_URL}
							displayType='secondary'
							onClick={handleCopyTargetUrl}
							title={copyTitle}
						>
							<ClayIcon symbol={isUrlCopied ? 'check' : 'copy'} />
						</ClayButton>
					</ClayInput.GroupItem>
				</ClayInput.Group>

				<ClayInput.GroupItem className='ml-0 w-100'>
					<label htmlFor='salesforceDataSource'>
						{Liferay.Language.get('salesforce-data-source')}
					</label>
				</ClayInput.GroupItem>

				<ClayInput.GroupItem className='mb-3 ml-0 w-100'>
					<ClayInput
						onChange={event =>
							setSalesforceDataSource(event.target.value)
						}
						type='text'
						value={salesforceDataSource}
					/>
				</ClayInput.GroupItem>

				<ClayInput.GroupItem className='ml-0 w-100'>
					<label htmlFor='consumerKeyClientId'>
						{Liferay.Language.get('consumer-key-client-id')}
					</label>
				</ClayInput.GroupItem>

				<ClayInput.GroupItem className='mb-3 ml-0 w-100'>
					<ClayInput
						onChange={event =>
							setConsumerKeyClientId(event.target.value)
						}
						type='text'
						value={consumerKeyClientId}
					/>
				</ClayInput.GroupItem>

				<ClayInput.GroupItem className='ml-0 w-100'>
					<label htmlFor='consumerSecretClientSecret	'>
						{Liferay.Language.get('consumer-secret-client-secret')}
					</label>
				</ClayInput.GroupItem>

				<ClayInput.GroupItem className='ml-0 w-100'>
					<ClayInput
						onChange={event =>
							setConsumerSecretClientSecret(event.target.value)
						}
						type='text'
						value={consumerSecretClientSecret}
					/>
				</ClayInput.GroupItem>

				<ClayInput.GroupItem className='ml-0 w-100' shrink>
					<ClayButton className='mt-3' onClick={() => {}}>
						{Liferay.Language.get('connect')}
					</ClayButton>
				</ClayInput.GroupItem>
			</ClayInput.Group>
		</>
	);
};

export default ReconnectSalesforce;
