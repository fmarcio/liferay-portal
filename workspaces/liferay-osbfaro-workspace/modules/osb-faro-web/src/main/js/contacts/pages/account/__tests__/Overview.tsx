import Overview from '../Overview';
import React from 'react';
import {AccountOverviewMetricType} from '../utils/types';
import {cleanup, render, screen} from '@testing-library/react';

jest.unmock('react-dom');

jest.mock('react-router', () => ({
	...jest.requireActual('react-router'),
	useParams: () => ({channelId: '456', groupId: '123'}),
}));

const mockAccount = {
	accountName: 'IQVIA',
	accountType: 'Prospect',
	annualRevenue: 11359000000,
	country: 'United States',
	id: 'acc-1',
	industry: 'Business Services',
	lifecycleStage: 'ENGAGED',
};

const mockOverviewMetrics = [
	{metricType: AccountOverviewMetricType.TotalIndividuals, value: 4230},
	{metricType: AccountOverviewMetricType.KnownIndividuals, value: 120},
	{metricType: AccountOverviewMetricType.AnonymousIndividuals, value: 45},
	{metricType: AccountOverviewMetricType.ReturningIndividuals, value: 80},
	{metricType: AccountOverviewMetricType.FirstTimeIndividuals, value: 40},
	{metricType: AccountOverviewMetricType.InactiveIndividuals, value: 12},
];

const mockRequest = (state: object) => {
	const useRequest = require('shared/hooks/useRequest');

	useRequest.useRequest = jest.fn(() => state);
};

describe('Overview', () => {
	afterEach(cleanup);

	beforeEach(() => mockRequest({data: mockOverviewMetrics, loading: false}));

	it('should render the account firmographics from the account', () => {
		render(<Overview account={mockAccount} />);

		expect(screen.getByText('IQVIA')).toBeInTheDocument();
		expect(screen.getByText('United States')).toBeInTheDocument();
		expect(screen.getByText('11.36B Revenue')).toBeInTheDocument();
		expect(screen.getByText('Business Services')).toBeInTheDocument();
		expect(screen.getByText('Lifecycle: Engaged')).toBeInTheDocument();
		expect(screen.getByText('Type: Prospect')).toBeInTheDocument();
	});

	it('should render no lifecycle label when the account has none', () => {
		render(<Overview account={{...mockAccount, lifecycleStage: null}} />);

		expect(screen.getByText('IQVIA')).toBeInTheDocument();
		expect(screen.queryByText(/Lifecycle/)).not.toBeInTheDocument();
	});

	it('should render no account type label when the account has none', () => {
		render(<Overview account={{...mockAccount, accountType: ''}} />);

		expect(screen.getByText('IQVIA')).toBeInTheDocument();
		expect(screen.queryByText(/Type:/)).not.toBeInTheDocument();
	});

	it('should render the card without an account', () => {
		const {container} = render(<Overview />);

		expect(screen.getByText('ACCOUNT INFO')).toBeInTheDocument();
		expect(container.querySelectorAll('.label')).toHaveLength(0);
	});

	it('should title every individuals metrics card', () => {
		render(<Overview account={mockAccount} />);

		expect(screen.getByText('TOTAL INDIVIDUALS')).toBeInTheDocument();
		expect(screen.getByText('IDENTITY BREAKDOWN')).toBeInTheDocument();
		expect(screen.getByText('ENGAGEMENT STATUS')).toBeInTheDocument();
		expect(screen.getByText('INACTIVE USERS')).toBeInTheDocument();
	});

	it('should feed every metrics card from the account overview', () => {
		const {container} = render(<Overview account={mockAccount} />);

		expect(container).toHaveTextContent('4.23K Individuals');
		expect(container).toHaveTextContent('120 Known');
		expect(container).toHaveTextContent('45 Anonymous');
		expect(container).toHaveTextContent('80 Returning');
		expect(container).toHaveTextContent('40 First-Time');
		expect(container).toHaveTextContent('12 No Activity');
	});

	it('should render a metric the overview omits as zero', () => {
		mockRequest({
			data: [
				{
					metricType: AccountOverviewMetricType.TotalIndividuals,
					value: 4230,
				},
			],
			loading: false,
		});

		const {container} = render(<Overview account={mockAccount} />);

		expect(container).toHaveTextContent('4.23K Individuals');
		expect(container).toHaveTextContent('0 Known');
		expect(container).toHaveTextContent('0 No Activity');
	});
});
