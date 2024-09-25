/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React, {useContext, useMemo, useState} from 'react';
import {Line} from 'recharts';

import {AnalyticsReportsContext} from '../../AnalyticsReportsContext';
import {Colors, MetricType} from '../../types/global';
import {assetContent, metricNameByType} from '../../utils/metrics';
import {CircleDot, PublishedVersionDot} from '../metrics/Dots';
import MetricsChart, {DataKey} from '../metrics/MetricsChart';
import {IMetricsChartLegendProps} from '../metrics/MetricsChartLegend';
import {formatter, getFillOpacity} from '../metrics/utils';
import {Data} from './VisitorsBehavior';
import VisitorsBehaviorChartTooltip from './VisitorsBehaviorChartTooltip';
import {VisitorsBehaviorDataKey, formatVisitorsBehaviorData} from './utils';

interface IVisitorsBehaviorChartProps {
	data: Data;
}

const VisitorsBehaviorChart: React.FC<IVisitorsBehaviorChartProps> = ({
	data,
}) => {
	const {filters} = useContext(AnalyticsReportsContext);

	const [activeLegendItem, setActiveLegendItem] = useState<
		VisitorsBehaviorDataKey | DataKey | null
	>(null);

	const metricName =
		metricNameByType[filters?.metric || MetricType.Undefined];

	const formattedData = useMemo(
		() =>
			formatVisitorsBehaviorData({
				data,
				metricName,
				...assetContent[metricName],
			}),
		[data, metricName]
	);

	const metricsChartData = formattedData.data[VisitorsBehaviorDataKey.Metric];
	const publishedVersionsChartData =
		formattedData.data[VisitorsBehaviorDataKey.PublishedVersionData];

	const legendItems: IMetricsChartLegendProps['legendItems'] = [
		{
			Dot: CircleDot,
			dataKey: VisitorsBehaviorDataKey.Metric,
			dotColor: metricsChartData?.color ?? 'none',
			title: metricsChartData.title,
			total:
				metricsChartData?.format?.(Number(metricsChartData.total)) ?? 0,
		},
		{
			Dot: PublishedVersionDot,
			dataKey: VisitorsBehaviorDataKey.PublishedVersionData,
			dotColor: publishedVersionsChartData?.color ?? 'none',
			title: publishedVersionsChartData.title,
			total: formatter('number')(
				Number(publishedVersionsChartData.total)
			),
		},
	];

	return (
		<MetricsChart
			MetricsChartTooltip={VisitorsBehaviorChartTooltip}
			emptyChartProps={{
				description: Liferay.Language.get(
					'check-back-later-to-verify-if-data-has-been-received-from-your-data-sources'
				),
				link: {
					title: Liferay.Language.get(
						'learn-more-about-visitors-behavior'
					),
					url: '',
				},
				show: !formattedData.combinedData.length,
				title: Liferay.Language.get(
					'there-is-no-data-for-visitors-behavior'
				),
			}}
			formattedData={formattedData}
			legendItems={legendItems}
			onDatakeyChange={(dataKey) =>
				setActiveLegendItem(dataKey as VisitorsBehaviorDataKey)
			}
			rangeSelector={filters.rangeSelector}
			tooltipTitle={Liferay.Language.get('visitors-behavior')}
			xAxisDataKey={VisitorsBehaviorDataKey.Metric}
		>
			<Line
				activeDot={
					<CircleDot stroke={metricsChartData.color ?? 'none'} />
				}
				animationDuration={100}
				dataKey={VisitorsBehaviorDataKey.Metric}
				dot={<CircleDot stroke={metricsChartData.color ?? 'none'} />}
				fill={Colors.Blue}
				fillOpacity={getFillOpacity(
					VisitorsBehaviorDataKey.Metric,
					activeLegendItem
				)}
				legendType="plainline"
				stroke={metricsChartData.color ?? 'none'}
				strokeOpacity={getFillOpacity(
					VisitorsBehaviorDataKey.Metric,
					activeLegendItem
				)}
				strokeWidth={2}
				type="linear"
			/>

			<Line
				activeDot={<PublishedVersionDot stroke={Colors.Black} />}
				animationDuration={100}
				dataKey={VisitorsBehaviorDataKey.PublishedVersionData}
				dot={<PublishedVersionDot stroke={Colors.Black} />}
				stroke={Colors.Black}
				strokeOpacity={getFillOpacity(
					VisitorsBehaviorDataKey.PublishedVersionData,
					activeLegendItem
				)}
				strokeWidth={2}
				type="monotone"
			/>
		</MetricsChart>
	);
};

export default VisitorsBehaviorChart;
