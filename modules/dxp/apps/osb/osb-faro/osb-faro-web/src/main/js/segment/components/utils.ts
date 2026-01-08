import {ColorType} from '@clayui/core';
import {TrendClassification} from 'segment/types';

export function getStatsIcon(trendPercentage: number) {
	if (trendPercentage > 0) {
		return 'caret-top';
	} else if (trendPercentage < 0) {
		return 'caret-bottom';
	}
	return '';
}

export function getTrendSign(previousValue: number) {
	if (previousValue > 0) {
		return '+';
	} else if (previousValue < 0) {
		return '-';
	}
	return '';
}

export function getStatsColor(trendClassification: any) {
	const map = {
		[TrendClassification.Negative]: 'danger',
		[TrendClassification.Neutral]: 'secondary',
		[TrendClassification.Positive]: 'success'
	};

	return map[trendClassification] as ColorType;
}
