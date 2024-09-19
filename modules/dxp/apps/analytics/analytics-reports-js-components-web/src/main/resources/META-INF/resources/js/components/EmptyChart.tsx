/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayEmptyState from '@clayui/empty-state';
import ClayLink from '@clayui/link';
import classNames from 'classnames';
import React from 'react';

interface IComposedChart {
	description: string;
	show?: boolean;
	title: string;
}

const ChartEmptyState: React.FC<IComposedChart> = ({
	children,
	description,
	show = true,
	title,
}) => {
	return (
		<div
			className={classNames('empty-chart', {
				'empty-chart--show': show,
			})}
		>
			{children}

			{show && (
				<div className="empty-chart-content">
					<ClayEmptyState
						description={description}
						small
						title={title}
					/>

					<ClayLink href="https://learn.liferay.com/w/analytics-cloud/touchpoints/assets/documents-and-media#visitor-behavior">
						{Liferay.Language.get(
							'learn-more-about-visitors-behavior'
						)}
					</ClayLink>
				</div>
			)}
		</div>
	);
};

export default ChartEmptyState;
