import fs from 'fs';
import path from 'path';
import PropertyCell from '../cell-components/Property';
import React from 'react';
import {compileString} from 'sass';
import {render} from '@testing-library/react';

jest.unmock('react-dom');

const CLAY_NOWRAP = '.table-nowrap td {white-space: nowrap;}';

const LONG_VALUE = '[244764032,371715813,2175409,20143,44345138,302641144]';

describe('attributes table wrapping', () => {
	beforeAll(() => {
		const scss = fs.readFileSync(
			path.resolve(__dirname, '../../../../../css/_entity_details_list.scss'),
			'utf8'
		);

		const {css} = compileString(`$mainLighten28: #000;\n${scss}`);

		const styleElement = document.createElement('style');

		styleElement.textContent = `${CLAY_NOWRAP}\n${css}`;

		document.head.appendChild(styleElement);
	});

	const renderRow = (wrapperClassName) => {
		const {container} = render(
			<div className={wrapperClassName}>
				<table className="table table-nowrap">
					<tbody>
						<tr>
							<PropertyCell
								data={{name: 'groupIds', value: LONG_VALUE}}
							/>

							<td>
								<a className="text-truncate" href="/x">
									{'Salesforce'}
								</a>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		);

		return container;
	};

	it.each(['all-attributes-cdp-table', 'entity-details-list-root'])(
		'should wrap a long attribute value inside .%s',
		(wrapperClassName) => {
			const container = renderRow(wrapperClassName);

			const {overflowWrap, whiteSpace} = getComputedStyle(
				container.querySelector('.property-cell')
			);

			expect(`${whiteSpace} ${overflowWrap}`).toBe('normal anywhere');
		}
	);

	it('should wrap the data source link, which carries its own text-truncate', () => {
		const container = renderRow('all-attributes-cdp-table');

		expect(
			getComputedStyle(container.querySelector('.text-truncate'))
				.whiteSpace
		).toBe('normal');
	});

	it('should leave a table outside the attributes wrapper untouched', () => {
		const container = renderRow('some-other-table');

		expect(
			getComputedStyle(container.querySelector('.property-cell'))
				.whiteSpace
		).toBe('nowrap');
	});
});
