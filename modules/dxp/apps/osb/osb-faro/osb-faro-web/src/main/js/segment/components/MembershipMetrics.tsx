import Card from 'shared/components/Card';
import ClayIcon from '@clayui/icon';
import ClayPopover from '@clayui/popover';
import Loading from 'shared/components/Loading';
import React from 'react';
import {addAlert} from 'shared/actions/alerts';
import {Alert} from 'shared/types';
import {ClayButtonWithIcon} from '@clayui/button';
import {connect, ConnectedProps} from 'react-redux';
import {convertMillisecondsToDays} from 'shared/util/date';
import {fetchMembershipMetrics} from 'shared/api/individual-segment';
import {getPercentage} from 'shared/util/util';
import {getStatsColor, getStatsIcon, getTrendSign} from './utils';
import {
	Metric,
	metricsDescription,
	metricsTitles,
	TrendClassification
} from 'segment/types';
import {ReportContainer} from 'shared/components/download-report/DownloadPDFReport';
import {sub} from 'shared/util/lang';
import {Text} from '@clayui/core';
import {toThousands} from 'shared/util/numbers';
import {useParams} from 'react-router-dom';
import {useRequest} from 'shared/hooks/useRequest';

const connector = connect(null, {
	addAlert
});

type PropsFromRedux = ConnectedProps<typeof connector>;

interface ICardSectionProps {
	data: Metric;
	description: string;
	error: boolean;
	title: string;
	totalIndividuals?: number;
	trendComparison?: any;
}

export const CardSection: React.FC<ICardSectionProps> = ({
	data,
	description,
	error,
	title,
	totalIndividuals,
	trendComparison
}) => {
	const isAverageSegmentMetric =
		title === metricsTitles.averageSegmentMembershipDurationMetric;

	const rawValue = data?.value || 0;

	let displayValue = '';

	if (!error) {
		if (isAverageSegmentMetric) {
			const days = convertMillisecondsToDays(rawValue);

			const label = sub(
				days > 1
					? Liferay.Language.get('x-days').toLowerCase()
					: Liferay.Language.get('x-day').toLowerCase(),
				[days]
			);

			displayValue = `${label}`;
		} else {
			const languageKey =
				rawValue === 1
					? Liferay.Language.get('member').toLowerCase()
					: Liferay.Language.get('members').toLowerCase();

			displayValue = `${toThousands(rawValue)} ${languageKey}`;
		}
	}

	const previousDurationDays = convertMillisecondsToDays(data?.previousValue);

	const previousValueComparison =
		(data?.previousValue * trendComparison) / 100;

	return (
		<div className='card-section d-flex flex-column justify-content-between my-3 px-3 type-trend-root w-100'>
			<div className='d-flex align-items-center justify-content-between'>
				<div className='d-flex align-items-center'>
					<Card.Title>{title}</Card.Title>

					<ClayPopover
						alignPosition='top'
						closeOnClickOutside
						header={title}
						trigger={
							<ClayButtonWithIcon
								displayType='unstyled'
								size='xs'
								symbol='question-circle-full'
							></ClayButtonWithIcon>
						}
					>
						{description}
					</ClayPopover>
				</div>

				<span className='text-secondary text-uppercase font-weight-semibold'>
					{title ===
						metricsTitles.averageSegmentMembershipDurationMetric ||
					title === metricsTitles.totalMemberMetric
						? Liferay.Language.get('last-30-days')
						: Liferay.Language.get('last-24-hours')}
				</span>
			</div>

			<h2 className='text-secondary my-3'>
				{error &&
					title ===
						metricsTitles.averageSegmentMembershipDurationMetric &&
					`${Liferay.Language.get('0-days')}`.toLowerCase()}

				{error &&
					(title === metricsTitles.totalMemberMetric ||
						title === metricsTitles.entryRateMetric ||
						title === metricsTitles.exitRate) &&
					`${Liferay.Language.get('0-members')}`.toLowerCase()}

				{!error && displayValue}
			</h2>

			<div className='d-flex flex-row'>
				{totalIndividuals && (
					<>
						<span className='mr-1 text-secondary'>
							<span>
								{title === metricsTitles.totalMemberMetric
									? sub(
											Liferay.Language.get(
												'x-percent-of-all-individuals'
											),
											[
												getPercentage(
													data?.value,
													totalIndividuals
												)
											]
									  )
									: sub(
											Liferay.Language.get(
												'x-percent-of-all-members'
											),
											[
												getPercentage(
													data?.value,
													totalIndividuals
												)
											]
									  )}
							</span>
						</span>

						<span className='mx-3 text-secondary'>{'|'}</span>
					</>
				)}

				<span
					className={`text-${getStatsColor(
						data?.trend?.trendClassification ||
							TrendClassification.Neutral
					)}`}
				>
					{trendComparison && (
						<Text
							color={getStatsColor(
								data?.trend?.trendClassification
							)}
							size={3}
						>
							<span className='mr-1'>
								{getTrendSign(previousValueComparison)}
								{previousDurationDays}
							</span>

							<span>
								{previousDurationDays > 1
									? Liferay.Language.get('days')
									: Liferay.Language.get('day')}
							</span>
						</Text>
					)}

					{!trendComparison && data?.trend?.percentage && (
						<Text size={3}>
							{data?.trend?.percentage && (
								<span className='ml-1'>
									<ClayIcon
										symbol={getStatsIcon(
											data?.trend?.percentage
										)}
									/>
									{data?.trend?.percentage}
								</span>
							)}

							{Liferay.Language.get('percent')}
						</Text>
					)}
				</span>

				<span className='ml-1 text-secondary'>
					{title === metricsTitles.totalMemberMetric ||
					title ===
						metricsTitles.averageSegmentMembershipDurationMetric
						? Liferay.Language.get('vs-last-30-days')
						: Liferay.Language.get('vs-last-30-days-avg')}
				</span>
			</div>
		</div>
	);
};

const MembershipMetrics: React.FC<PropsFromRedux> = ({addAlert}) => {
	const {groupId, id} = useParams();

	const {data, error, loading} = useRequest({
		dataSourceFn: fetchMembershipMetrics,
		variables: {groupId, individualSegmentId: id}
	});

	if (error) {
		addAlert({
			alertType: Alert.Types.Error,
			message: Liferay.Language.get(
				'there-was-an-error-processing-your-request.-try-again.-if-the-problem-persists,-please-contact-support'
			)
		});
	}

	if (loading) {
		return <Loading />;
	}

	return (
		<div className='membership-metrics-root'>
			<Card id={ReportContainer.AverageSegmentMembershipDurationCard}>
				<CardSection
					data={data?.averageSegmentMembershipDurationMetric}
					description={
						metricsDescription.averageSegmentMembershipDurationMetric
					}
					error={error}
					title={metricsTitles.averageSegmentMembershipDurationMetric}
					trendComparison={
						data?.averageSegmentMembershipDurationMetric?.trend
							?.percentage
					}
				/>
			</Card>

			<Card
				className='d-flex flex-row justify-content-between'
				id={ReportContainer.MembershipMetricsCard}
			>
				<CardSection
					data={data?.totalMemberMetric}
					description={metricsDescription.totalMemberMetric}
					error={error}
					title={metricsTitles.totalMemberMetric}
					totalIndividuals={data?.totalMemberMetric?.totalIndividuals}
				/>

				<CardSection
					data={data?.entryRateMetric}
					description={metricsDescription.entryRateMetric}
					error={error}
					title={metricsTitles.entryRateMetric}
					totalIndividuals={data?.totalMemberMetric?.totalIndividuals}
				/>

				<CardSection
					data={data?.exitRateMetric}
					description={metricsDescription.exitRate}
					error={error}
					title={metricsTitles.exitRate}
					totalIndividuals={data?.totalMemberMetric?.totalIndividuals}
				/>
			</Card>
		</div>
	);
};

export default connector(MembershipMetrics);
