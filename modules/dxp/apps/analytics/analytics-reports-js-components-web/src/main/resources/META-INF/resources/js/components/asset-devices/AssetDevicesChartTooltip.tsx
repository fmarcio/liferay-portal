/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React from 'react';

import {
	Alignments,
	MetricType,
	RangeSelectors,
	Weights,
} from '../../types/global';
import {getDateRange} from '../../utils/date';
import {getPercentage, toThousands} from '../../utils/math';
import ChartTooltip from '../metrics/ChartTooltip';

export const MetricsTitle: {
	[key in MetricType]: string;
} = {
	[MetricType.Comments]: Liferay.Language.get('comments-by-technology'),
	[MetricType.Downloads]: Liferay.Language.get('downloads-by-technology'),
	[MetricType.Previews]: Liferay.Language.get('previews-by-technology'),
	[MetricType.Views]: Liferay.Language.get('views-by-technology'),
	[MetricType.Undefined]: Liferay.Language.get('undefined'),
};

const AssetDevicesChartTooltip = (props: {
	dataKey: string;
	TESTDATA: any;
	metricType: MetricType;
	rangeSelector: RangeSelectors;
	total: number;
	value: number;
}) => {
	const {dataKey, metricType, rangeSelector, total, value} = props;

	const header = [
		{
			columns: [
				{
					label: MetricsTitle[metricType],
					weight: Weights.Semibold,
					width: 180,
				},
				{
					align: Alignments.Right,
					label: () => (
						<span className="text-secondary text-uppercase">
							{getDateRange(rangeSelector)}
						</span>
					),
					width: 100,
				},

				{
					align: Alignments.Right,
					label: () => (
						<span className="text-secondary text-uppercase">%</span>
					),
					width: 50,
				},
			],
		},
	];

	const rows = [
		{
			columns: [
				{
					label: dataKey,
				},
				{
					align: Alignments.Right,
					label: toThousands(value),
				},
				{
					align: Alignments.Right,
					label: String(getPercentage((total / value) * 100) + '%'),
				},
			],
		},
	];

	return (
		<div
			className="bb-tooltip-container metrics-chart__tooltip"
			style={{maxWidth: 400, position: 'static'}}
		>
			<ChartTooltip header={header} rows={rows} />
		</div>
	);
};

export default AssetDevicesChartTooltip;
