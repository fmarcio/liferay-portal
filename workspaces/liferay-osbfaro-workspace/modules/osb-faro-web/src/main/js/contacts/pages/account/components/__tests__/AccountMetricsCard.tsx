import AccountMetricsCard from '../AccountMetricsCard';
import React from 'react';
import {cleanup, render, screen} from '@testing-library/react';

jest.unmock('react-dom');

describe('AccountMetricsCard', () => {
	afterEach(cleanup);

	it('should uppercase the title', () => {
		render(
			<AccountMetricsCard
				metrics={[{label: '{0} Individuals', value: 1}]}
				title="Total Individuals"
			/>
		);

		expect(screen.getByText('TOTAL INDIVIDUALS')).toBeInTheDocument();
	});

	it('should substitute the value into its label', () => {
		const {container} = render(
			<AccountMetricsCard
				metrics={[{label: '{0} Individuals', value: 4230}]}
				title="Total Individuals"
			/>
		);

		expect(container).toHaveTextContent('4.23K Individuals');
	});

	it('should render the value bigger and bolder than its label', () => {
		render(
			<AccountMetricsCard
				metrics={[{label: '{0} Individuals', value: 4230}]}
				title="Total Individuals"
			/>
		);

		const value = screen.getByText('4.23K');
		const label = value.parentElement;

		expect(value).toHaveClass('text-6', 'font-weight-semi-bold');
		expect(label).toHaveClass('text-4');
		expect(label).not.toHaveClass('font-weight-semi-bold');
	});

	it('should render every metric of a group', () => {
		const {container} = render(
			<AccountMetricsCard
				metrics={[
					{label: '{0} Known', value: 120},
					{label: '{0} Anonymous', value: 45},
				]}
				title="Identity Breakdown"
			/>
		);

		expect(container).toHaveTextContent('120 Known');
		expect(container).toHaveTextContent('45 Anonymous');
	});

	it('should render a missing value as zero', () => {
		const {container} = render(
			<AccountMetricsCard
				metrics={[{label: '{0} No Activity'}]}
				title="Inactive Users"
			/>
		);

		expect(container).toHaveTextContent('0 No Activity');
	});

	it('should render a loading indicator rather than the metrics', () => {
		const {container} = render(
			<AccountMetricsCard
				loading
				metrics={[{label: '{0} Individuals', value: 1}]}
				title="Total Individuals"
			/>
		);

		expect(screen.getByText('TOTAL INDIVIDUALS')).toBeInTheDocument();
		expect(container).not.toHaveTextContent('1 Individuals');
		expect(container.querySelectorAll('.loading-root')).toHaveLength(1);
	});
});
