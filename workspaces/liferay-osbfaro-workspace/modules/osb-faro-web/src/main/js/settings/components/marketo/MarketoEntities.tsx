import ClayIcon from '@clayui/icon';
import ClayList from '@clayui/list';
import ClaySticker from '@clayui/sticker';
import React from 'react';
import {ClayCheckbox} from '@clayui/form';
import {sub} from 'shared/util/lang';

/**
 * TODO [Marketo]: This component is currently a copy of
 * SalesforceAccountsAndIndividuals and still uses Salesforce logic. Update once
 * the Marketo entity model is defined:
 * - Replace the accounts/individuals model with the real Marketo entities.
 * - Replace the Salesforce-worded language keys
 *   ('represents-fields-from-the-account-object-within-salesforce' and
 *   'represents-fields-from-the-contact-or-lead-object-within-salesforce').
 */

interface IMarketoEntitiesProps {
	accountsSyncedCount?: number;
	disabled?: boolean;
	enabledAccount: boolean;
	enabledIndividual: boolean;
	individualsSyncedCount?: number;
	loading?: boolean;
	onAccountChange: () => void;
	onIndividualChange: () => void;
	type?: string;
}

const MarketoEntities: React.FC<IMarketoEntitiesProps> = ({
	accountsSyncedCount,
	disabled = false,
	enabledAccount,
	enabledIndividual,
	individualsSyncedCount,
	onAccountChange,
	onIndividualChange,
}) => (
	<div className="pt-1">
		<ClayList className="mb-0">
			<ClayList.Item flex>
				<ClayList.ItemField>
					<ClayCheckbox
						checked={enabledAccount}
						disabled={disabled}
						onChange={onAccountChange}
					/>
				</ClayList.ItemField>

				<ClayList.ItemField>
					<ClaySticker displayType="unstyled">
						<ClayIcon
							className="text-secondary"
							symbol="briefcase"
						/>
					</ClaySticker>
				</ClayList.ItemField>

				<ClayList.ItemField expand>
					<ClayList.ItemTitle>
						{Liferay.Language.get('accounts')}
					</ClayList.ItemTitle>

					{/* TODO [Marketo]: Salesforce-worded language key. */}
					<ClayList.ItemText>
						{Liferay.Language.get(
							'represents-fields-from-the-account-object-within-salesforce'
						)}
					</ClayList.ItemText>

					{accountsSyncedCount !== undefined &&
						accountsSyncedCount >= 0 && (
							<ClayList.ItemText>
								{sub(Liferay.Language.get('x-items-synced'), [
									accountsSyncedCount,
								])}
							</ClayList.ItemText>
						)}
				</ClayList.ItemField>
			</ClayList.Item>

			<ClayList.Item flex>
				<ClayList.ItemField>
					<ClayCheckbox
						checked={enabledIndividual}
						disabled={disabled}
						onChange={onIndividualChange}
					/>
				</ClayList.ItemField>

				<ClayList.ItemField>
					<ClaySticker displayType="unstyled">
						<ClayIcon className="text-secondary" symbol="users" />
					</ClaySticker>
				</ClayList.ItemField>

				<ClayList.ItemField
					className="d-flex justify-content-center"
					expand
				>
					<ClayList.ItemTitle>
						{Liferay.Language.get('individuals')}
					</ClayList.ItemTitle>

					{/* TODO [Marketo]: Salesforce-worded language key. */}
					<ClayList.ItemText>
						{Liferay.Language.get(
							'represents-fields-from-the-contact-or-lead-object-within-salesforce'
						)}
					</ClayList.ItemText>

					{individualsSyncedCount !== undefined &&
						individualsSyncedCount >= 0 && (
							<ClayList.ItemText>
								{sub(Liferay.Language.get('x-items-synced'), [
									individualsSyncedCount,
								])}
							</ClayList.ItemText>
						)}
				</ClayList.ItemField>
			</ClayList.Item>
		</ClayList>
	</div>
);

export default MarketoEntities;
