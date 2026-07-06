import ClayForm from '@clayui/form';
import MarketoEntities from 'settings/components/marketo/MarketoEntities';
import React, {useEffect, useState} from 'react';
import {addAlert} from 'shared/actions/alerts';
import {Alert} from 'shared/types';
import {Text} from '@clayui/core';
import {updateSalesforce} from 'shared/api/data-source';
import {useParams} from 'react-router-dom';
import {useWizardPage} from '../../base-page/WizardPageContext';
import {WizardPageButtonGroup} from 'settings/components/base-page/WizardPageButtonGroup';

/**
 * TODO [Marketo]: This step is currently a copy of SyncSalesforceDataStep and
 * still uses Salesforce logic. Update once the Marketo sync API is defined:
 * - Replace updateSalesforce with the Marketo update call.
 * - Replace the Salesforce accounts/contacts configuration shape with the
 *   Marketo equivalent.
 */

interface ISyncMarketoCampaignDataStepProps {
	onNext: () => void;
	onPrev: () => void;
}

const SyncMarketoCampaignDataStep = ({onNext, onPrev}: ISyncMarketoCampaignDataStepProps) => {
	const [loading, setLoading] = useState(false);
	const {dataSource} = useWizardPage();
	const {groupId = ''} = useParams<{groupId: string}>();
	const [enabledAccount, setEnabledAccount] = useState(false);
	const [enabledIndividual, setEnabledIndividual] = useState(false);

	useEffect(() => {
		if (dataSource) {
			const accounts = dataSource.provider?.getIn([
				'accountsConfiguration',
				'enableAllAccounts',
			]);

			const contactsConfiguration = dataSource.provider?.get(
				'contactsConfiguration'
			);

			const individuals =
				contactsConfiguration?.get('enableAllContacts') &&
				contactsConfiguration?.get('enableAllLeads');

			setEnabledAccount(accounts);
			setEnabledIndividual(individuals);
		}
	}, []);

	return (
		<ClayForm
			onSubmit={async (event) => {
				event.preventDefault();

				if (!dataSource) {
					return;
				}

				try {
					setLoading(true);

					// TODO [Marketo]: Salesforce API and config shape.

					await updateSalesforce({
						accountsConfiguration: {
							enableAllAccounts: enabledAccount,
						},
						contactsConfiguration: {
							enableAllContacts: enabledIndividual,
							enableAllLeads: enabledIndividual,
						},
						groupId,
						id: dataSource.id,
					} as any);
				}
				catch (error) {
					addAlert({
						alertType: Alert.Types.Error,
						message: Liferay.Language.get(
							'there-was-an-error-processing-your-request.-try-again.-if-the-problem-persists,-please-contact-support'
						),
					});
				}
				finally {
					setLoading(false);

					onNext();
				}
			}}
		>
			<div className="mb-2">
				<Text size={2} weight="semi-bold">
					{Liferay.Language.get('connection-status').toUpperCase()}
				</Text>
			</div>

			{dataSource && (
				<MarketoEntities
					enabledAccount={enabledAccount}
					enabledIndividual={enabledIndividual}
					onAccountChange={() => setEnabledAccount(!enabledAccount)}
					onIndividualChange={() =>
						setEnabledIndividual(!enabledIndividual)
					}
					type="checkbox"
				/>
			)}

			<WizardPageButtonGroup
				nextButtonLabel={Liferay.Language.get('continue')}
				nextButtonLoading={loading}
				onCancel={onPrev}
				prevButtonLabel={Liferay.Language.get('previous')}
			/>
		</ClayForm>
	);
};

export {SyncMarketoCampaignDataStep};
