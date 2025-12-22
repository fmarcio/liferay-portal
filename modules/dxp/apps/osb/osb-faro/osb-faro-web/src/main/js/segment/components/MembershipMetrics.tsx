import Card from 'shared/components/Card';
import ClayIcon from '@clayui/icon';
import ClayPopover from '@clayui/popover';
import React from 'react';
import {ClayButtonWithIcon} from '@clayui/button';
import {ColorType, Text} from '@clayui/core';
import {convertMillisecondsToDays} from 'shared/util/date';
import {fetchMembershipMetrics} from 'shared/api/individuals';
import {getPercentage} from 'shared/util/util';
import {
	Metric,
	metricsDescription,
	metricsTitles,
	TrendClassification
} from 'segment/types';
import {sub} from 'shared/util/lang';
import {toThousands} from 'shared/util/numbers';
import {useParams} from 'react-router-dom';
import {useRequest} from 'shared/hooks/useRequest';

interface ICardSectionProps {
	data: Metric;
	description: string;
	title: string;
	totalIndividuals?: number;
	trendComparison?: any;
}

function getStatsIcon(trendPercentage: number) {
	if (trendPercentage > 0) {
		return 'caret-top';
	} else if (trendPercentage < 0) {
		return 'caret-bottom';
	}
	return '';
}

export function getStatsColor(trendClassification: any) {
	const map = {
		[TrendClassification.Negative]: 'danger',
		[TrendClassification.Neutral]: 'secondary',
		[TrendClassification.Positive]: 'success'
	};

	return map[trendClassification] as ColorType;
}

export const CardSection: React.FC<ICardSectionProps> = ({
	data,
	description,
	title,
	totalIndividuals,
	trendComparison
}) => {
	const DIFF = (data.value * trendComparison) / 100;

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
					{title === metricsTitles.averageSegmentMembershipDuration ||
					title === metricsTitles.totalMembers
						? Liferay.Language.get('last-30-days')
						: Liferay.Language.get('last-24-hours')}
				</span>
			</div>

			<h2 className='text-secondary my-3'>
				{title === metricsTitles.averageSegmentMembershipDuration
					? `${convertMillisecondsToDays(
							data.value
					  )} ${Liferay.Language.get('days')}`
					: `${toThousands(data.value)} ${Liferay.Language.get(
							'members'
					  )}`}
			</h2>

			<div className='d-flex flex-row'>
				{totalIndividuals && (
					<>
						<span className='mr-1 text-secondary'>
							<span>
								{title === metricsTitles.totalMembers
									? sub(
											Liferay.Language.get(
												'x-percent-of-all-individuals'
											),
											[
												getPercentage(
													data.value,
													totalIndividuals
												).toFixed(2)
											]
									  )
									: sub(
											Liferay.Language.get(
												'x-percent-of-all-members'
											),
											[
												getPercentage(
													data.value,
													totalIndividuals
												).toFixed(2)
											]
									  )}
							</span>
						</span>

						<span className='mx-3 text-secondary'>{'|'}</span>
					</>
				)}

				<span
					className={`text-${getStatsColor(
						data.trend.classification
					)} ml-1`}
				>
					<Text
						color={getStatsColor(data.trend.classification)}
						size={3}
					>
						{trendComparison ? (
							<Text
								color={getStatsColor(data.trend.classification)}
								size={3}
							>
								{`${
									DIFF > 0 ? '+' : ''
								} ${convertMillisecondsToDays(
									DIFF
								)} ${Liferay.Language.get('days')}`}
							</Text>
						) : (
							<Text size={3}>
								<ClayIcon
									symbol={getStatsIcon(data.trend.percentage)}
								/>

								{data.trend.percentage * 100}
								{Liferay.Language.get('percent')}
							</Text>
						)}
					</Text>
				</span>

				<span className='ml-1 text-secondary'>
					{title === metricsTitles.totalMembers ||
					title === metricsTitles.averageSegmentMembershipDuration
						? Liferay.Language.get('vs-last-30-days')
						: Liferay.Language.get('vs-last-30-days-avg')}
				</span>
			</div>
		</div>
	);
};

const MembershipMetrics = () => {
	const {groupId, id} = useParams();

	const {
		data: {
			averageSegmentMembershipDuration,
			entryRate,
			exitRate,
			totalMembers
		}
	} = useRequest({
		dataSourceFn: fetchMembershipMetrics,
		variables: {groupId, id}
	});

	return (
		<div className='membership-metrics-root'>
			<Card>
				<CardSection
					data={averageSegmentMembershipDuration}
					description={
						metricsDescription.averageSegmentMembershipDuration
					}
					title={metricsTitles.averageSegmentMembershipDuration}
					trendComparison={
						averageSegmentMembershipDuration.trend.percentage
					}
				/>
			</Card>

			<Card className='d-flex flex-row justify-content-between'>
				<CardSection
					data={totalMembers}
					description={metricsDescription.totalMembers}
					title={metricsTitles.totalMembers}
					totalIndividuals={totalMembers.totalIndividuals}
				/>

				<CardSection
					data={entryRate}
					description={metricsDescription.entryRate}
					title={metricsTitles.entryRate}
					totalIndividuals={totalMembers.totalIndividuals}
				/>

				<CardSection
					data={exitRate}
					description={metricsDescription.exitRate}
					title={metricsTitles.exitRate}
					totalIndividuals={totalMembers.totalIndividuals}
				/>
			</Card>
		</div>
	);
};

export default MembershipMetrics;
