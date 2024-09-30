/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React, {useContext, useEffect, useState} from 'react';

import {AnalyticsReportsContext} from '../../AnalyticsReportsContext';
import {fetchAssetDevices} from '../../apis/analytics-reports';
import {AssetTypes} from '../../types/global';
import StateRenderer from '../StateRenderer';
import Title from '../Title';
import AssetDevicesChart from './AssetDevicesChart';

export type Data = {
	deviceMetrics: {
		metricName: string;
		metrics?: {
			value: number;
			valueKey: string;
		}[];
	}[];
};

const AssetDevices = () => {
	const {assetId, assetType, filters, groupId} = useContext(
		AnalyticsReportsContext
	);

	const [data, setData] = useState<Data | null>(null);
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

	return (
		<>
			<Title
				description={Liferay.Language.get(
					'total-number-of-downloads-broken-down-by-device-types-during-the-selected-time-period'
				)}
				section
				value={Liferay.Language.get(`${filters.metric}-by-technology`)}
			/>

			<StateRenderer data={data} error={error} loading={loading}>
				{({data}) => <AssetDevicesChart data={data} />}
			</StateRenderer>
		</>
	);
};

export default AssetDevices;
