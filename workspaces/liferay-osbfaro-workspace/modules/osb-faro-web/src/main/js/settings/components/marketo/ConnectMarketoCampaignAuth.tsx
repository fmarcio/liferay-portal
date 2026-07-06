import ClayAlert from '@clayui/alert';
import ClayButton from '@clayui/button';
import ClayForm, {ClayInput} from '@clayui/form';
import ClayIcon from '@clayui/icon';
import Clipboard from 'clipboard';
import Form from 'shared/components/form';
import getCN from 'classnames';
import React, {useEffect, useRef, useState} from 'react';
import {Alert} from 'shared/types';
import {
	createMarketoCampaign,
	updateMarketoCampaign
} from 'shared/api/data-source';
import {DataSource} from 'shared/util/records';
import {DataSourceStatuses} from 'shared/util/constants';
import {FormikProps} from 'formik';
import {OAUTH_CALLBACK_URL} from 'shared/util/oauth';
import {sequence} from 'shared/util/promise';
import {sub} from 'shared/util/lang';
import {Text} from '@clayui/core';
import {useParams} from 'react-router-dom';
import {validateMarketoDomain, validateRequired} from 'shared/util/validators';

/**
 * Maps the HTTP status code of a failed connect request to a user-friendly
 * message. Any status not listed here (e.g. 408, 409, 423, 429, 500, 502, 503,
 * 504) falls back to the generic message in marketoAuthErrorMessage.
 */
const MARKETO_AUTH_ERROR_MESSAGE_MAP: Record<number, string> = {
	401: Liferay.Language.get(
		'the-credentials-are-invalid-or-have-expired.-verify-your-credentials-and-try-again'
	),
	403: Liferay.Language.get(
		'your-account-or-organization-is-not-eligible.-verify-your-data-source-configuration-and-try-again'
	),
	404: Liferay.Language.get(
		'the-external-platform-could-not-be-reached.-verify-your-data-source-configuration-and-try-again'
	),
	422: Liferay.Language.get(
		'the-credentials-are-invalid-or-have-expired.-verify-your-credentials-and-try-again'
	)
};

function marketoAuthErrorMessage(status?: number) {
	return (
		(status != null && MARKETO_AUTH_ERROR_MESSAGE_MAP[status]) ||
		Liferay.Language.get(
			'there-was-an-error-processing-your-request.-try-again.-if-the-problem-persists,-please-contact-support'
		)
	);
}

interface IConnectMarketoCampaignAuthProps {
	/**
	 * When disabled, the form renders with all inputs
	 * read-only and without any buttons.
	 */
	disabled?: boolean;
	addAlert: any;
	dataSource?: DataSource;
	onCancel?: () => void;
	onSubmit: (dataSource: DataSource) => void;
	buttonProps?: {
		[key: string]: any;
	};
}

const ConnectMarketoCampaignAuth: React.FC<
	IConnectMarketoCampaignAuthProps
> = ({addAlert, buttonProps, dataSource, disabled, onCancel, onSubmit}) => {
	const {groupId = ''} = useParams<{groupId: string}>();

	const [isUrlCopied, setIsUrlCopied] = useState(false);
	const [copyTitle, setCopyTitle] = useState(
		Liferay.Language.get('click-to-copy')
	);
	const [missingFields, setMissingFields] = useState<string[]>([]);
	const [showClientId, setShowClientId] = useState(false);
	const [showClientSecret, setShowClientSecret] = useState(false);

	const _formRef = useRef<FormikProps<any>>(null);

	useEffect(() => {
		const _clipboard = new Clipboard('[data-clipboard-text]');

		_clipboard.on('success', (event: {clearSelection: () => void}) => {
			setCopyTitle(Liferay.Language.get('copied'));

			addAlert({
				alertType: Alert.Types.Success,
				message: Liferay.Language.get('copied')
			});

			setTimeout(() => {
				setCopyTitle(Liferay.Language.get('click-to-copy'));
				setIsUrlCopied(false);
			}, 3000);

			event.clearSelection();
		});

		return () => _clipboard.destroy();
	}, []);

	return (
		<Form
			initialValues={{
				clientId: dataSource?.credentials?.get('oAuthClientId'),
				clientSecret: dataSource?.credentials?.get('oAuthClientSecret'),
				marketoDataSource: dataSource?.url
			}}
			innerRef={_formRef}
			onSubmit={(values: any) => {
				const {setSubmitting} = _formRef.current!;

				const baseURL = values.marketoDataSource;

				const credentials = {
					oAuthAuthorizationURL: baseURL,
					oAuthClientId: values.clientId,
					oAuthClientSecret: values.clientSecret,
					type: 'OAuth 2 Authentication'
				};

				const url = baseURL;

				const handleError = (error: any) => {
					addAlert({
						alertType: Alert.Types.Error,
						message: marketoAuthErrorMessage(error?.status)
					});
				};

				if (dataSource) {
					const updatedDataSource = {
						credentials,
						groupId,
						id: dataSource.id,
						name: dataSource.name,
						status: DataSourceStatuses.Active,
						url
					} as any;

					return updateMarketoCampaign(updatedDataSource)
						.then(() => {
							addAlert({
								alertType: Alert.Types.Success,
								message: Liferay.Language.get(
									'connection-established-successfully'
								)
							});

							onSubmit(updatedDataSource);
						})
						.catch(handleError)
						.finally(() => {
							setSubmitting(false);
						});
				}

				return createMarketoCampaign({
					credentials,
					groupId,
					name: 'MARKETO_CAMPAIGN',
					status: DataSourceStatuses.Active,
					url
				})
					.then(response => {
						addAlert({
							alertType: Alert.Types.Success,
							message: Liferay.Language.get(
								'connection-established-successfully'
							)
						});

						onSubmit(response);
					})
					.catch(handleError)
					.finally(() => {
						setSubmitting(false);
					});
			}}
		>
			{({handleSubmit, isSubmitting, isValid, values}) => (
				<Form.Form
					className='oauth-form-root'
					onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
						if (!isValid) {
							const emptyFields = [];

							if (!values.marketoDataSource) {
								emptyFields.push(
									Liferay.Language.get('data-source-url')
								);
							}

							if (!values.clientId) {
								emptyFields.push(
									Liferay.Language.get(
										'consumer-key-client-id'
									)
								);
							}

							if (!values.clientSecret) {
								emptyFields.push(
									Liferay.Language.get(
										'consumer-secret-client-secret'
									)
								);
							}

							setMissingFields(emptyFields);
						} else {
							setMissingFields([]);
						}

						handleSubmit(event);
					}}
				>
					{missingFields.length > 0 && (
						<ClayAlert
							displayType='danger'
							title={Liferay.Language.get('error')}
						>
							{Liferay.Language.get(
								'please-review-the-following-fields-before-saving'
							)}

							<ul className='mb-0'>
								{missingFields.map(field => (
									<li key={field}>{field}</li>
								))}
							</ul>
						</ClayAlert>
					)}

					{/* TODO [Marketo]: This callback URL belongs to the OAuth redirect flow, which is unused now that the popup auth was removed. Remove this section (and its clipboard logic) if the Marketo connection does not need a callback URL. */}
					<ClayForm.Group
						className={getCN({
							'has-success': isUrlCopied
						})}
					>
						<label htmlFor='callbackURL'>
							<Text weight='semi-bold'>
								{Liferay.Language.get(
									'liferay-data-platform-callback-url'
								)}
							</Text>

							<div>
								<Text
									color='secondary'
									size={3}
									weight='normal'
								>
									{Liferay.Language.get(
										'this-is-the-callback-url-the-data-source-will-redirect-to-after-the-connection'
									)}
								</Text>
							</div>
						</label>

						<ClayInput.Group>
							<ClayInput.GroupItem prepend>
								<ClayInput
									id='callbackURL'
									insetAfter
									name='callbackURL'
									readOnly={!isUrlCopied}
									type='text'
									value={OAUTH_CALLBACK_URL}
								/>
							</ClayInput.GroupItem>

							<ClayInput.GroupItem append shrink>
								<ClayButton
									aria-label={copyTitle}
									data-clipboard-text={OAUTH_CALLBACK_URL}
									displayType={
										isUrlCopied ? 'success' : 'secondary'
									}
									onClick={() => setIsUrlCopied(true)}
									outline
									title={copyTitle}
								>
									<ClayIcon
										symbol={isUrlCopied ? 'check' : 'copy'}
									/>
								</ClayButton>
							</ClayInput.GroupItem>
						</ClayInput.Group>
					</ClayForm.Group>

					{/* TODO [Marketo]: validateMarketoDomain currently mirrors the loose https:// check; tighten it once the expected Marketo URL format is confirmed. */}
					<Form.Input
						className='mb-3'
						id='marketoDataSource'
						label={Liferay.Language.get('data-source-url')}
						name='marketoDataSource'
						readOnly={disabled}
						required
						type='text'
						validate={sequence([
							(value: string) =>
								validateRequired(
									value,
									sub(
										Liferay.Language.get(
											'the-x-field-is-required'
										),
										[
											Liferay.Language.get(
												'data-source-url'
											)
										]
									) as string
								),
							validateMarketoDomain
						])}
					/>

					<Form.Input
						className='mb-3'
						contentAfter={
							<ClayButton
								aria-label={
									showClientId
										? Liferay.Language.get('view')
										: Liferay.Language.get('hidden')
								}
								displayType='secondary'
								onClick={() => setShowClientId(!showClientId)}
							>
								<ClayIcon
									symbol={showClientId ? 'view' : 'hidden'}
								/>
							</ClayButton>
						}
						contentAfterEnableMagnet
						id='clientId'
						label={Liferay.Language.get('consumer-key-client-id')}
						name='clientId'
						readOnly={disabled}
						required
						type={showClientId ? 'text' : 'password'}
						validate={(value: string) =>
							validateRequired(
								value,
								sub(
									Liferay.Language.get(
										'the-x-field-is-required'
									),
									[
										Liferay.Language.get(
											'consumer-key-client-id'
										)
									]
								) as string
							)
						}
					/>

					<Form.Input
						className='mb-4'
						contentAfter={
							<ClayButton
								aria-label={
									showClientSecret
										? Liferay.Language.get('view')
										: Liferay.Language.get('hidden')
								}
								displayType='secondary'
								onClick={() =>
									setShowClientSecret(!showClientSecret)
								}
							>
								<ClayIcon
									symbol={
										showClientSecret ? 'view' : 'hidden'
									}
								/>
							</ClayButton>
						}
						contentAfterEnableMagnet
						id='clientSecret'
						label={Liferay.Language.get(
							'consumer-secret-client-secret'
						)}
						name='clientSecret'
						readOnly={disabled}
						required
						type={showClientSecret ? 'text' : 'password'}
						validate={(value: string) =>
							validateRequired(
								value,
								sub(
									Liferay.Language.get(
										'the-x-field-is-required'
									),
									[
										Liferay.Language.get(
											'consumer-secret-client-secret'
										)
									]
								) as string
							)
						}
					/>

					{!disabled && (
						<>
							<ClayButton
								{...buttonProps}
								disabled={isSubmitting}
								loading={isSubmitting}
								type='submit'
							>
								{Liferay.Language.get('connect')}
							</ClayButton>

							{onCancel && (
								<ClayButton
									block
									borderless
									displayType='secondary'
									onClick={onCancel}
								>
									{Liferay.Language.get('cancel')}
								</ClayButton>
							)}
						</>
					)}
				</Form.Form>
			)}
		</Form>
	);
};

export {ConnectMarketoCampaignAuth};
