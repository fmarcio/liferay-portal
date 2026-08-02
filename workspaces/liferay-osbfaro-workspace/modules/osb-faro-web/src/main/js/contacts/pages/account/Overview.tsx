import * as API from 'shared/api';
import AccountInfoBar from './components/AccountInfoBar';
import AccountMetricsCard from './components/AccountMetricsCard';
import ClayLayout from '@clayui/layout';
import React from 'react';
import {AccountOverviewMetricType, IAccountOverviewMetric} from './utils/types';
import {IAccount} from './components/AccountInfo';
import {useParams} from 'react-router';
import {useRequest} from 'shared/hooks/useRequest';

interface IOverviewProps {
	account?: IAccount;
}

const Overview: React.FC<IOverviewProps> = ({account}) => {
	const {channelId, groupId} = useParams<{
		channelId: string;
		groupId: string;
	}>();

	const {data, loading} = useRequest({
		dataSourceFn: API.accounts.fetchOverviewMetrics,
		variables: {channelId, groupId},
	});

	const metrics = data as IAccountOverviewMetric[] | undefined;

	const getCount = (metricType: AccountOverviewMetricType) =>
		metrics?.find((metric) => metric.metricType === metricType)?.value;

	return (
		<section>
			<AccountInfoBar
				accountName={account?.accountName}
				accountType={account?.accountType}
				annualRevenue={account?.annualRevenue}
				country={account?.country}
				industry={account?.industry}
				lifecycleStage={account?.lifecycleStage}
			/>

			<ClayLayout.Row>
				<ClayLayout.Col lg={3} md={6}>
					<AccountMetricsCard
						loading={loading}
						metrics={[
							{
								label: Liferay.Language.get('x-individuals'),
								value: getCount(
									AccountOverviewMetricType.TotalIndividuals
								),
							},
						]}
						title={Liferay.Language.get('total-individuals')}
					/>
				</ClayLayout.Col>

				<ClayLayout.Col lg={3} md={6}>
					<AccountMetricsCard
						loading={loading}
						metrics={[
							{
								label: Liferay.Language.get('x-known'),
								value: getCount(
									AccountOverviewMetricType.KnownIndividuals
								),
							},
							{
								label: Liferay.Language.get('x-anonymous'),
								value: getCount(
									AccountOverviewMetricType.AnonymousIndividuals
								),
							},
						]}
						title={Liferay.Language.get('identity-breakdown')}
					/>
				</ClayLayout.Col>

				<ClayLayout.Col lg={3} md={6}>
					<AccountMetricsCard
						loading={loading}
						metrics={[
							{
								label: Liferay.Language.get('x-returning'),
								value: getCount(
									AccountOverviewMetricType.ReturningIndividuals
								),
							},
							{
								label: Liferay.Language.get('x-first-time'),
								value: getCount(
									AccountOverviewMetricType.FirstTimeIndividuals
								),
							},
						]}
						title={Liferay.Language.get('engagement-status')}
					/>
				</ClayLayout.Col>

				<ClayLayout.Col lg={3} md={6}>
					<AccountMetricsCard
						loading={loading}
						metrics={[
							{
								label: Liferay.Language.get('x-no-activity'),
								value: getCount(
									AccountOverviewMetricType.InactiveIndividuals
								),
							},
						]}
						title={Liferay.Language.get('inactive-users')}
					/>
				</ClayLayout.Col>
			</ClayLayout.Row>
		</section>
	);
};

export default Overview;
