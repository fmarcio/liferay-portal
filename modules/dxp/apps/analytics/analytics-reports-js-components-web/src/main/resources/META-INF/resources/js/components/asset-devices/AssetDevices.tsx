/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React, {useContext, useEffect, useState} from 'react';
import Title from '../Title';

import {AnalyticsReportsContext} from 'js/AnalyticsReportsContext';
import {AssetTypes} from 'js/types/global';

import {fetchAssetDevices} from 'js/apis/analytics-reports';
import StateRenderer from '../StateRenderer';
import AssetDevicesChart from './AssetDevicesChart';

const AssetDevices = () => {
	const {assetId, assetType, filters, groupId} = useContext(
		AnalyticsReportsContext
	);

	// TODO: checar o type que vai no lugar de any

	const [data, setData] = useState<any | null>(null);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchData() {
			setLoading(true);

			try {
				const response = await fetchAssetDevices({
					assetId,
					assetType: assetType || AssetTypes.Undefined,
					groupId,
					individual: filters.individual,
					rangeSelector: filters.rangeSelector,
				});

				if (!response.ok) {
					throw new Error();
				}

				const data = await response.json();

				if (data.error) {
					throw new Error(data.error);
				}

				setData(data);
				setLoading(false);
				setError('');
			}
			catch (error: any) {
				if (process.env.NODE_ENV === 'development') {
					console.error(error);
				}

				setData(null);
				setLoading(false);
				setError(error.toString());
			}
		}

		fetchData();
	}, [
		assetId,
		assetType,
		filters.individual,
		filters.rangeSelector,
		groupId,
	]);

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

	const mockedResponse2 = {
		deviceMetrics: [],
	};

	return (
		<>
			<Title
				description={Liferay.Language.get(
					'total-number-of-downloads-broken-down-by-device-types-during-the-selected-time-period'
				)}
				section
				value={Liferay.Language.get(`${filters.metric}-by-technology`)}
			/>

			<AssetDevicesChart data={mockedResponse} />

			{/* 
			<StateRenderer data={data} error={error} loading={loading}>
				{({data}) => <CustomStackedBarChart data={data} />}
			</StateRenderer> */}
		</>
	);
};

export default AssetDevices;
