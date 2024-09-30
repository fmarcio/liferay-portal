export type MetricEntry = {
	value: number;
	valueKey: string;
};

export type DeviceMetric = {
	metricName: string;
	metrics?: MetricEntry[];
};

export type ApiResponse = {
	deviceMetrics?: DeviceMetric[];
};

export const formatData = (data: ApiResponse) => {
	const formattedData: Record<string, any> = {};

	data?.deviceMetrics?.forEach((metric: DeviceMetric) => {
		metric.metrics?.forEach((entry: MetricEntry) => {
			if (!formattedData[metric.metricName]) {
				formattedData[metric.metricName] = {name: metric.metricName};
			}
			formattedData[metric.metricName][entry.valueKey] = entry.value;
		});
	});

	return Object.values(formattedData);
};

export const getUniqueValueKeys = (data: ApiResponse): string[] => {
	const valueKeysSet = new Set<string>();

	data?.deviceMetrics?.forEach((metric: DeviceMetric) => {
		metric.metrics?.forEach((entry: MetricEntry) => {
			valueKeysSet.add(entry.valueKey);
		});
	});

	return Array.from(valueKeysSet);
};
