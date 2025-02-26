/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

function transformAssetTypeToSelector(
	assetType: string | string[],
	suffix: string = ''
): string {
	if (typeof assetType === 'object') {
		return assetType
			.map((type) => `[data-analytics-asset-type="${type}"]${suffix}`)
			.join(', ');
	}

	return `[data-analytics-asset-type="${assetType}"]${suffix}`;
}

/**
 * Returns first webContent element ancestor of given element.
 */
function getClosestAssetElement(
	element: Element,
	assetType: string | string[]
) {
	return closest(element, transformAssetTypeToSelector(assetType));
}

function closest(element: Element, selector: string): Element | null {
	if (element.closest) {
		return element.closest(selector);
	}

	if (!document.documentElement.contains(element)) {
		return null;
	}

	do {
		if (element.matches(selector)) {
			return element;
		}

		element = (element.parentElement || element.parentNode) as Element;
	} while (element !== null && element.nodeType === 1);

	return null;
}

/**
 * Return all words from an element
 */
function getNumberOfWords({innerText}: {innerText: string}): number {
	const words = innerText.split(/\s+/).filter(Boolean);

	return innerText !== '' ? words.length : 0;
}

function isTrackable(
	element: HTMLElement,
	customDatasetList: string[]
): boolean {
	const datasetList = customDatasetList || [
		'analyticsAssetId',
		'analyticsAssetTitle',
		'analyticsAssetType',
	];

	return (
		element && datasetList.every((dataset) => dataset in element.dataset)
	);
}

export {
	closest,
	getClosestAssetElement,
	getNumberOfWords,
	isTrackable,
	transformAssetTypeToSelector,
};

/**
 * Polyfill for .matches in IE11
 */
if (!Element.prototype.matches) {
	Element.prototype.matches = (Element.prototype as any).msMatchesSelector;
}
