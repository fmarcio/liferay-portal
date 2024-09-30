/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React from 'react';

import {Alignments, Colors, Weights} from 'js/types/global';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	Cell,
	ResponsiveContainer,
} from 'recharts';
import {ApiResponse, formatData, getUniqueValueKeys} from './utils';
import ChartTooltip from '../metrics/ChartTooltip';

interface IAssetDevicesChartProps {
	data: ApiResponse;
}

const mockedResponse = {
	deviceMetrics: [
		{
			metricName: 'viewsMetric',
			metrics: [
				{
					value: 8,
					valueKey: 'totem',
				},
				{
					value: 5,
					valueKey: 'blob',
				},
				{
					value: 2,
					valueKey: 'bliui',
				},
				{
					value: 1,
					valueKey: 'doidera',
				},
			],
		},
	],
};

const header = [
	{
		columns: [
			{
				label: 'TEST',
				weight: Weights.Semibold,
				width: 155,
			},
			{
				align: Alignments.Right,
				label: '11-11-11',
				width: 55,
			},
		],
	},
];

const rows = [
	{
		columns: [
			{
				label: 'ROW TEST',
			},
		],
	},
];

const AssetDevicesChart: React.FC<IAssetDevicesChartProps> = ({data}) => {
	const formattedData = formatData(data);

	const valueKeys = getUniqueValueKeys(data);

	const barColorPatterns = [
		'url(#cyanBar)',
		'url(#indigoBar)',
		'url(#yellowBar)',
		'url(#pinkBar)',
	];

	const isEmptyState =
		!data?.deviceMetrics || data?.deviceMetrics.length === 0;

	return (
		<ResponsiveContainer width="100%" height={70}>
			{isEmptyState ? (
				<BarChart
					data={[
						{
							name: Liferay.Language.get('no-data-available'),
							value: 100,
						},
					]}
					layout="vertical"
					margin={{top: 20, right: 30, left: 20, bottom: 15}}
					barSize={100}
				>
					<XAxis type="number" hide />
					<YAxis type="category" hide dataKey="name" />
					<Bar
						dataKey="value"
						fill={Colors.Gray}
						radius={[5, 5, 5, 5]}
					/>
				</BarChart>
			) : (
				<BarChart
					data={formattedData}
					layout="vertical"
					margin={{top: 20, right: 30, left: 20, bottom: 15}}
					width={200}
					height={100}
					barSize={100}
				>
					<XAxis type="number" hide />

					<YAxis type="category" hide dataKey="name" />

					<Tooltip
						content={
							<div
								className="bb-tooltip-container metrics-chart__tooltip"
								style={{maxWidth: 400, position: 'static'}}
							>
								<ChartTooltip header={header} rows={rows} />
							</div>
						}
						position={{y: -60}} // Ajusta o tooltip levemente acima
					/>

					<defs>
						<pattern
							id="cyanBar"
							patternUnits="userSpaceOnUse"
							width="10"
							height="10"
						>
							<rect width="10" height="10" fill={Colors.Cyan} />
							<path d="M 10 0 L 0 0 0 10" fill="none" />
						</pattern>

						<pattern
							id="indigoBar"
							patternUnits="userSpaceOnUse"
							width="10"
							height="10"
						>
							<rect width="10" height="10" fill={Colors.Indigo} />
							<path
								d="M 0 20 L 10 10 10 0"
								fill="none"
								stroke="#FFFFFF"
								strokeWidth="0.5"
							/>
						</pattern>

						<pattern
							id="yellowBar"
							patternUnits="userSpaceOnUse"
							width="10"
							height="10"
						>
							<rect width="10" height="10" fill={Colors.Yellow} />
							<path
								d="M 0 10 L 10 0"
								stroke="#FFFFFF"
								strokeWidth="0.5"
							/>
						</pattern>

						<pattern
							id="pinkBar"
							patternUnits="userSpaceOnUse"
							width="10"
							height="10"
						>
							<rect width="10" height="10" fill={Colors.Pink} />
							<path
								d="M 0 5 L 10 5"
								stroke="#FFFFFF"
								strokeWidth="0.5"
							/>
						</pattern>
					</defs>

					{valueKeys.map((key, index) => (
						<Bar
							key={key}
							dataKey={key}
							stackId="a"
							radius={
								index === 0
									? [5, 0, 0, 5]
									: index === 3
										? [0, 5, 5, 0]
										: undefined
							}
						>
							<Cell fill={barColorPatterns[index]} />
						</Bar>
					))}
				</BarChart>
			)}
		</ResponsiveContainer>
	);
};

export default AssetDevicesChart;
