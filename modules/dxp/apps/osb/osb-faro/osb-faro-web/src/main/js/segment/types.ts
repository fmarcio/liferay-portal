export type ColorType = 'danger' | 'secondary' | 'success';

export enum MetricNames {
	AverageSegmentMembershipDuration = 'averageSegmentMembershipDuration',
	EntryRate = 'entryRate',
	ExitRate = 'exitRate',
	TotalMembers = 'totalMembers'
}

export enum TrendClassification {
	Negative = 'NEGATIVE',
	Neutral = 'NEUTRAL',
	Positive = 'POSITIVE'
}

export type Trend = {
	classification: TrendClassification;
	percentage: number;
};

export type Metric = {
	trend: Trend;
	value: number;
};

export type TotalMembersMetric = Metric & {
	totalIndividuals: number;
};

export const metricsDescription: Record<MetricNames, string> = {
	[MetricNames.AverageSegmentMembershipDuration]: Liferay.Language.get(
		'average-amount-of-time-segment-members-have-belonged-to-the-segment-over-the-past-30-days'
	),
	[MetricNames.EntryRate]: Liferay.Language.get(
		'the-number-of-unique-profiles-that-newly-qualify-for-the-segment-during-the-past-24-hours'
	),
	[MetricNames.ExitRate]: Liferay.Language.get(
		'the-number-of-unique-profiles-that-no-longer-meet-the-segment-criteria-during-the-past-24-hours'
	),
	[MetricNames.TotalMembers]: Liferay.Language.get(
		'the-total-number-of-individuals-included-in-this-segment-whether-known-or-anonymous'
	)
};

export const metricsTitles: Record<MetricNames, string> = {
	[MetricNames.AverageSegmentMembershipDuration]: Liferay.Language.get(
		'average-segment-membership-duration'
	),
	[MetricNames.EntryRate]: Liferay.Language.get('entry-rate'),
	[MetricNames.ExitRate]: Liferay.Language.get('exit-rate'),
	[MetricNames.TotalMembers]: Liferay.Language.get('total-members')
};
