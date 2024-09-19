/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React, {useState} from 'react';
import {
	Bar,
	CartesianGrid,
	ComposedChart,
	Dot,
	Legend,
	Line,
	ResponsiveContainer,
	Text,
	TextProps,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

import {RangeSelectors} from '../types/global';
import {
	DataKey,
	FormattedData,
	calculateTickIntervals,
	formatXAxisDate,
	getFillOpacity,
} from '../utils/visitorsBehaviorChart';
import AccessibleTick, {IAccessibleTickProps} from './AccessibleTick';
import EmptyChart from './EmptyChart';
import VisitorsBehaviorLegend from './VisitorsBehaviorLegend';
import VisitorsBehaviorTooltip from './VisitorsBehaviorTooltip';

function getAxisTickAccessibility({
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

interface IVisitorsBehaviorChartProps {
	data: FormattedData;
	rangeSelector: RangeSelectors;
}

function getAxisTickText(
	axis: DataKey,
	formatter?: (value: number) => string | number
) {
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
			y={axis === 'y' ? y + offset : y}
		>
			{formatter ? formatter(value) : value}
		</Text>
	);
}

const VisitorsBehaviorChart: React.FC<IVisitorsBehaviorChartProps> = ({
	data,
	rangeSelector,
}) => {
	const [activeLegendItem, setActiveLegendItem] = useState<DataKey | null>(
		null
	);

	const [tooltipProps, setTooltipProps] = useState<IAccessibleTickProps>({
		index: 0,
		payload: {},
		visible: false,
		x: 0,
		y: 0,
	});

	return (
		<div className="visitors-behavior-chart">
			<EmptyChart
				description={Liferay.Language.get(
					'check-back-later-to-verify-if-data-has-been-received-from-your-data-sources'
				)}
				show={!data.combinedData.length}
				title={Liferay.Language.get(
					'there-is-no-data-for-visitors-behavior'
				)}
			>
				<ResponsiveContainer height={275}>
					<ComposedChart
						data={data.combinedData}
						onMouseLeave={() =>
							setTooltipProps({
								index: 0,
								visible: false,
								x: 0,
								y: 0,
							})
						}
						onMouseMove={(event) => {
							setTooltipProps({
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
							dataKey={DataKey.Metric}
							interval="preserveStart"
							stroke="#E7E7ED"
							tick={getAxisTickAccessibility({
								changeTooltipProps: setTooltipProps,
								formatter: (value) =>
									formatXAxisDate(value, rangeSelector),
								intervals: data.intervals,
								rangeSelector,
							})}
							tickLine={false}
						/>

						<YAxis
							axisLine={{
								stroke: '#E7E7ED',
							}}
							stroke="#E7E7ED"
							tick={getAxisTickText(
								DataKey.AxisY,
								data.data[DataKey.AxisY]?.format
							)}
							tickLine={false}
							width={40}
						/>

						<Line
							animationDuration={100}
							dataKey={DataKey.Metric}
							fill="#4B9BFF"
							fillOpacity={getFillOpacity(
								DataKey.Metric,
								activeLegendItem
							)}
							legendType="plainline"
							r={2}
							stroke="#4B9BFF"
							strokeOpacity={getFillOpacity(
								DataKey.Metric,
								activeLegendItem
							)}
							strokeWidth={2}
							type="linear"
						/>

						<Line
							animationDuration={100}
							dataKey={DataKey.PublishedVersionData}
							dot={<Dot fill="white" r={3} stroke="black" />}
							stroke="#000"
							strokeOpacity={getFillOpacity(
								DataKey.PublishedVersionData,
								activeLegendItem
							)}
							strokeWidth={2}
							type="monotone"
						/>

						{/* Hack to display the grid when there are no data to display */}

						{!data.combinedData.length && (
							<Bar dataKey={DataKey.AxisY} stackId="a" />
						)}

						<Tooltip
							content={() => {
								if (tooltipProps.visible) {
									return (
										<VisitorsBehaviorTooltip
											data={data}
											index={tooltipProps.index}
											rangeSeletor={rangeSelector}
										/>
									);
								}

								return <div>tooltip not visible</div>;
							}}
							cursor={!!data.intervals.length}
							wrapperStyle={{
								visibility: tooltipProps.visible
									? 'visible'
									: 'hidden',
							}}
						/>

						<Legend
							align="left"
							content={({payload}) => {
								if (payload?.length) {
									return (
										<VisitorsBehaviorLegend
											data={data}
											onMouseChange={setActiveLegendItem}
											payload={payload as any}
										/>
									);
								}

								return null;
							}}
						/>
					</ComposedChart>
				</ResponsiveContainer>
			</EmptyChart>
		</div>
	);
};

export default VisitorsBehaviorChart;
