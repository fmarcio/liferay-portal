/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React from 'react';
import {Bar, BarChart, ResponsiveContainer, XAxis, YAxis} from 'recharts';

import {Colors} from '../../types/global';

const AssetDevicesChartEmptyState = () => {
	return (
		<ResponsiveContainer height={24} width="100%">
			<BarChart
				barSize={24}
				data={[
					{
						name: Liferay.Language.get('no-data-available'),
						value: 100,
					},
				]}
				layout="vertical"
				margin={{bottom: 0, left: 0, right: 0, top: 0}}
			>
				<XAxis hide type="number" />

				<YAxis dataKey="name" hide type="category" />

				<Bar dataKey="value" fill={Colors.Gray} radius={[5, 5, 5, 5]} />
			</BarChart>
		</ResponsiveContainer>
	);
};

export default AssetDevicesChartEmptyState;
