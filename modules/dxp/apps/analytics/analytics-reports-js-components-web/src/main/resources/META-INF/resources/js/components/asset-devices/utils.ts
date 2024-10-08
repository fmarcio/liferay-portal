/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

export function formatData(
	selectedMetric:
		| {
				metricName: string;
				metrics?: {
					value: number;
					valueKey: string;
				}[];
		  }
		| undefined
): {[key in string]: string}[] | null {
	if (!selectedMetric || !selectedMetric.metrics?.length) {
		return null;
	}

	return [
		selectedMetric?.metrics?.reduce((acc, cur) => {
			return {
				...acc,
				[cur.valueKey]: cur.value,
			};
		}, {}),
	];
}
