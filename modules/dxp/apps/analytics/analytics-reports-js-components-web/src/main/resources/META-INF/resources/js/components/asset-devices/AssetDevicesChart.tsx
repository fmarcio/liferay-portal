/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React, {useContext} from 'react';
import {
	Bar,
	BarChart,
	Cell,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

import {AnalyticsReportsContext} from '../../AnalyticsReportsContext';
import {Colors, MetricType} from '../../types/global';
import {metricNameByType} from '../../utils/metrics';
import {Data} from './AssetDevices';
import AssetDevicesChartEmptyState from './AssetDevicesChartEmptyState';
import AssetDevicesChartTooltip from './AssetDevicesChartTooltip';
import {formatData} from './utils';

interface IAssetDevicesChartProps {
	data: Data;
}

const AssetDevicesChart: React.FC<IAssetDevicesChartProps> = ({data}) => {
	const {filters} = useContext(AnalyticsReportsContext);

	const metricName =
		metricNameByType[filters?.metric || MetricType.Undefined];

	const selectedMetric = data.deviceMetrics.find(
		(metric) => metric.metricName === metricName
	);

	const formattedData = formatData(selectedMetric);

	const valueKeys = Object.keys(formattedData?.[0] ?? {});

	const total =
		selectedMetric?.metrics?.reduce((acc, cur) => {
			const total = acc + cur.value;

			return total;
		}, 0) ?? 0;

	const barColorPatterns = [
		'url(#cyanBar)',
		'url(#indigoBar)',
		'url(#yellowBar)',
		'url(#pinkBar)',
	];

	if (!formattedData?.length) {
		return <AssetDevicesChartEmptyState />;
	}

	function getRadius(index: number): number[] | undefined {
		if (selectedMetric?.metrics?.length === 1) {
			return [5, 5, 5, 5];
		}

		if (index === 0) {
			return [5, 0, 0, 5];
		}

		if (index === 3) {
			return [0, 5, 5, 0];
		}

		return;
	}

	return (
		<ResponsiveContainer height={24} width="100%">
			<BarChart
				barSize={24}
				data={formattedData}
				layout="vertical"
				margin={{bottom: 0, left: 0, right: 0, top: 0}}
			>
				<XAxis hide type="number" />

				<YAxis dataKey="name" hide type="category" />

				<Tooltip
					content={({active, payload}) => {
						if (active && payload?.length) {

							// console.log({payload});

							return (
								<AssetDevicesChartTooltip
									{...(payload[0] as any)}
									metricType={
										filters.metric ?? MetricType.Undefined
									}
									rangeSelector={filters.rangeSelector}
									total={total}
								/>
							);
						}

						return null;
					}}
					position={{y: -80}}
				/>

				<defs>
					<pattern
						height="10"
						id="cyanBar"
						patternUnits="userSpaceOnUse"
						width="10"
					>
						<rect fill={Colors.Cyan} height="10" width="10" />

						<path d="M 10 0 L 0 0 0 10" fill="none" />
					</pattern>

					<pattern
						height="10"
						id="indigoBar"
						patternUnits="userSpaceOnUse"
						width="10"
					>
						<rect fill={Colors.Indigo} height="10" width="10" />

						<path
							d="M 0 20 L 10 10 10 0"
							fill="none"
							stroke="#FFFFFF"
							strokeWidth="0.5"
						/>
					</pattern>

					<pattern
						height="10"
						id="yellowBar"
						patternUnits="userSpaceOnUse"
						width="10"
					>
						<rect fill={Colors.Yellow} height="10" width="10" />

						<path
							d="M 0 10 L 10 0"
							stroke="#FFFFFF"
							strokeWidth="0.5"
						/>
					</pattern>

					<pattern
						height="10"
						id="pinkBar"
						patternUnits="userSpaceOnUse"
						width="10"
					>
						<rect fill={Colors.Pink} height="10" width="10" />

						<path
							d="M 0 5 L 10 5"
							stroke="#FFFFFF"
							strokeWidth="0.5"
						/>
					</pattern>
				</defs>

				{valueKeys.map((key, index) => (
					<Bar
						dataKey={key}
						key={key}
						radius={getRadius(index) as any}
						stackId="a"
					>
						<Cell fill={barColorPatterns[index]} />
					</Bar>
				))}
			</BarChart>
		</ResponsiveContainer>
	);
};

export default AssetDevicesChart;
