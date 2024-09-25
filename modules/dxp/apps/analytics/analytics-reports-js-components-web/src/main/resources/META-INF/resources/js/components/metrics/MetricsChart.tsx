/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React, {useState} from 'react';
import {
	Bar,
	CartesianGrid,
	ComposedChart,
	ResponsiveContainer,
	Text,
	TextProps,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

import {RangeSelectors} from '../../types/global';
import AccessibleTick, {IAccessibleTickProps} from './AccessibleTick';
import EmptyChart, {IChartEmptyStateProps} from './EmptyChart';
import MetricsChartLegend, {
	IMetricsChartLegendProps,
} from './MetricsChartLegend';
import {FormattedData, calculateTickIntervals, formatXAxisDate} from './utils';

export enum DataKey {
	AxisX = 'x',
	AxisY = 'y',
}

export function getAccessibleAxisX({
	changeTooltipProps,
	formatter,
	intervals,
	rangeSelector,
}: {
	changeTooltipProps: (props: IAccessibleTickProps) => void;
	formatter: (value: number) => string | number;
	intervals: (null | number)[];
	rangeSelector: RangeSelectors;
}) {
	return (tickProps: IAccessibleTickProps & {textAnchor: any}) => {
		const {index, textAnchor, x, y} = tickProps;

		const tickIntervals = calculateTickIntervals(
			intervals as number[],
			rangeSelector
		);

		const shouldRenderText = tickIntervals.includes(
			intervals[index] as number
		);

		return (
			<>
				<AccessibleTick
					{...tickProps}
					showTooltip={({index}) => {
						changeTooltipProps({
							index,
							visible: true,
							x: 0,
							y: 0,
						});
					}}
				/>

				{shouldRenderText && (
					<Text
						style={{
							fill: '#6B6C7E',
							fontSize: '0.75rem',
						}}
						textAnchor={textAnchor}
						x={x}
						y={y}
					>
						{formatter(intervals[index] as number)}
					</Text>
				)}
			</>
		);
	};
}

interface IMetricsChartProps extends React.HTMLAttributes<HTMLElement> {
	MetricsChartTooltip: React.JSXElementConstructor<any>;
	emptyChartProps: IChartEmptyStateProps;
	formattedData: FormattedData;
	legendItems: IMetricsChartLegendProps['legendItems'];
	onDatakeyChange: (dataKey: string | null) => void;
	rangeSelector: RangeSelectors;
	tooltipTitle: string;
	xAxisDataKey: string;
}

function getAxisTickY(formatter?: (value: number) => string | number) {
	return ({
		payload: {offset, value},
		textAnchor,
		x,
		y,
	}: {
		payload: {
			offset: number;
			value: number;
		};
		textAnchor: TextProps['textAnchor'];
		x: number;
		y: number;
	}) => (
		<Text
			style={{
				fill: '#6B6C7E',
				fontSize: '0.75rem',
			}}
			textAnchor={textAnchor}
			x={x}
			y={y + offset}
		>
			{formatter ? formatter(value) : value}
		</Text>
	);
}

const MetricsChart: React.FC<IMetricsChartProps> = ({
	MetricsChartTooltip,
	children,
	emptyChartProps,
	formattedData,
	legendItems,
	onDatakeyChange,
	rangeSelector,
	tooltipTitle,
	xAxisDataKey,
}) => {
	const [tooltipProps, setTooltipProps] = useState<IAccessibleTickProps>({
		index: 0,
		payload: {},
		visible: false,
		x: 0,
		y: 0,
	});

	const handleChangeTooltip = (tooltipProps: IAccessibleTickProps) => {
		setTooltipProps((prevState) => ({...prevState, ...tooltipProps}));
	};

	return (
		<div className="metrics-chart">
			<EmptyChart {...emptyChartProps}>
				<ResponsiveContainer height={275}>
					<ComposedChart
						data={formattedData.combinedData}
						onMouseLeave={() => {
							handleChangeTooltip({
								index: 0,
								visible: false,
								x: 0,
								y: 0,
							});
						}}
						onMouseMove={(event) => {
							handleChangeTooltip({
								index: event?.activeTooltipIndex ?? 0,
								visible: true,
								x: event?.activeCoordinate?.x ?? 0,
								y: event?.activeCoordinate?.y ?? 0,
							});
						}}
					>
						<CartesianGrid
							stroke="#E7E7ED"
							strokeDasharray="3 3"
							vertical={false}
						/>

						<XAxis
							axisLine={{
								stroke: '#E7E7ED',
							}}
							dataKey={xAxisDataKey}
							tick={getAccessibleAxisX({
								changeTooltipProps: handleChangeTooltip,
								formatter: (value) =>
									formatXAxisDate(value, rangeSelector),
								intervals: formattedData.intervals,
								rangeSelector,
							})}
							tickLine={false}
							tickMargin={14}
						/>

						<YAxis
							axisLine={{
								stroke: '#E7E7ED',
							}}
							stroke="#E7E7ED"
							tick={getAxisTickY(
								formattedData.data[DataKey.AxisY]?.format
							)}
							tickLine={false}
							width={40}
						/>

						{/* Hack to display the grid when there are no data to display */}

						{!formattedData.combinedData.length && (
							<Bar dataKey={DataKey.AxisY} stackId="a" />
						)}

						<Tooltip
							content={() => {
								if (tooltipProps.visible) {
									return (
										<MetricsChartTooltip
											{...tooltipProps}
											formattedData={formattedData}
											rangeSeletor={rangeSelector}
											title={tooltipTitle}
										/>
									);
								}

								return null;
							}}
							cursor={!!formattedData.intervals.length}
							wrapperStyle={{
								visibility: tooltipProps.visible
									? 'visible'
									: 'hidden',
							}}
						/>

						{children}
					</ComposedChart>
				</ResponsiveContainer>

				<MetricsChartLegend
					legendItems={legendItems}
					onDatakeyChange={onDatakeyChange}
				/>
			</EmptyChart>
		</div>
	);
};

export default MetricsChart;
