import ConnectorOverview from '../ConnectorOverview';
import mockStore from 'test/mock-store';
import {ConnectorConfig} from '../types';
import {DataSource} from 'shared/util/records';
import {DataSourceStatuses} from 'shared/util/constants';
import {fromJS} from 'immutable';
import {generateConnectorToken, updateConnector} from 'shared/api/connector';
import {Provider} from 'react-redux';
import {render, waitFor} from '@testing-library/react';

jest.unmock('react-dom');

const useParamsMock = jest.fn();
const useCurrentUserMock = jest.fn();
const useDisconnectDataSourceMock = jest.fn();
const useRequestMock = jest.fn();

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useParams: () => useParamsMock()
}));

jest.mock('shared/hooks/useCurrentUser', () => ({
	useCurrentUser: () => useCurrentUserMock()
}));

jest.mock('shared/hooks/useRequest', () => ({
	useRequest: (args: any) => useRequestMock(args)
}));

jest.mock('settings/components/data-source/utils', () => ({
	useDisconnectDataSource: (args: any) => useDisconnectDataSourceMock(args)
}));

jest.mock('shared/api/connector', () => ({
	generateConnectorToken: jest.fn(() =>
		Promise.resolve({token: 'fake-token'})
	),
	updateConnector: jest.fn(() => Promise.resolve({}))
}));

jest.mock('shared/api/data-source', () => ({
	fetch: jest.fn(() => Promise.resolve({}))
}));

jest.mock('settings/components/base-page/BasePage', () => ({
	__esModule: true,
	default: ({children}: any) => <div>{children}</div>
}));

jest.mock('settings/components/AssignedPropertiesTable', () => ({
	AssignedPropertiesTable: () => <div data-testid='assigned-properties' />
}));

jest.mock('settings/components/data-source/DataSourceEditableTitle', () => ({
	DataSourceEditableTitle: ({label}: any) => (
		<div data-testid='data-source-title'>{label}</div>
	)
}));

jest.mock('settings/components/CopyInputValue', () => ({
	CopyInputValue: ({title, value}: any) => (
		<div data-testid='copy-input'>
			<span data-testid='copy-input-title'>{title}</span>
			<span data-testid='copy-input-value'>{value}</span>
		</div>
	)
}));

const buildConfig = (
	overrides: Partial<ConnectorConfig> = {}
): ConnectorConfig => ({
	columns: [],
	displayName: 'Acme',
	endpointPath: '/api/acme',
	entities: [],
	languages: {
		activeConnectedWithData: 'ACTIVE_CONNECTED_WITH_DATA',
		activeConnectedWithDataInfo: 'ACTIVE_CONNECTED_WITH_DATA_INFO',
		activeConnectedWithZeroData: 'ACTIVE_CONNECTED_WITH_ZERO_DATA',
		connectDescription: 'connectDescription',
		connectTitle: 'connectTitle',
		disconnectedAlert: 'DISCONNECTED_ALERT',
		endpointHelper: 'endpointHelper',
		endpointLabel: 'endpointLabel',
		inactiveConnectedWithSomeDataButNoDataFor90Days:
			'INACTIVE_CONNECTED_WITH_SOME_DATA',
		inactiveConnectedWithSomeDataButNoDataFor90DaysInfo:
			'INACTIVE_CONNECTED_WITH_SOME_DATA_INFO',
		inactiveManualDisconnection: 'INACTIVE_MANUAL_DISCONNECTION',
		inactiveNoConnectionWithoutData: 'INACTIVE_NO_CONNECTION_WITHOUT_DATA',
		reconnectHelper: 'reconnectHelper',
		successAlert: 'SUCCESS_ALERT',
		syncHelper: 'syncHelper',
		tokenLabel: 'tokenLabel'
	},
	singleton: false,
	slug: 'acme',
	type: 'ACME',
	...overrides
});

const buildDataSource = (status: string, providerData: any = null) =>
	new DataSource({
		id: 'ds-1',
		name: 'My Data Source',
		provider: providerData ? fromJS(providerData) : undefined,
		status
	});

const renderOverview = (
	props: Partial<{
		config: ConnectorConfig;
		dataSource: DataSource;
	}> = {}
) =>
	render(
		<Provider store={mockStore()}>
			<ConnectorOverview
				config={props.config ?? buildConfig()}
				dataSource={
					props.dataSource ??
					buildDataSource(DataSourceStatuses.Active)
				}
			/>
		</Provider>
	);

describe('ConnectorOverview', () => {
	beforeEach(() => {
		(generateConnectorToken as jest.Mock).mockClear();
		(updateConnector as jest.Mock).mockClear();

		useParamsMock.mockReturnValue({groupId: '23', id: 'ds-1'});
		useCurrentUserMock.mockReturnValue({isAdmin: () => true});
		useDisconnectDataSourceMock.mockReturnValue({
			handleDisconnect: jest.fn()
		});
		useRequestMock.mockReturnValue({
			data: undefined,
			error: false,
			loading: false
		});
	});

	describe('connection status messages', () => {
		it('renders activeConnectedWithZeroData when active and count is 0', () => {
			useRequestMock.mockReturnValue({
				data: 0,
				error: false,
				loading: false
			});

			const {getByText} = renderOverview();

			expect(getByText('ACTIVE_CONNECTED_WITH_ZERO_DATA')).toBeTruthy();
		});

		it('renders activeConnectedWithData and its info message when active and count > 0', () => {
			useRequestMock.mockReturnValue({
				data: 42,
				error: false,
				loading: false
			});

			const {getByText} = renderOverview();

			expect(getByText('ACTIVE_CONNECTED_WITH_DATA')).toBeTruthy();
			expect(getByText('ACTIVE_CONNECTED_WITH_DATA_INFO')).toBeTruthy();
		});

		it('renders inactiveNoConnectionWithoutData when inactive and count is 0', () => {
			useRequestMock.mockReturnValue({
				data: 0,
				error: false,
				loading: false
			});

			const {getByText} = renderOverview({
				dataSource: buildDataSource(DataSourceStatuses.Inactive)
			});

			expect(
				getByText('INACTIVE_NO_CONNECTION_WITHOUT_DATA')
			).toBeTruthy();
		});

		it('renders inactiveConnectedWithSomeDataButNoDataFor90Days and its info message when inactive and count > 0', () => {
			useRequestMock.mockReturnValue({
				data: 15,
				error: false,
				loading: false
			});

			const {getByText} = renderOverview({
				dataSource: buildDataSource(DataSourceStatuses.Inactive)
			});

			expect(getByText('INACTIVE_CONNECTED_WITH_SOME_DATA')).toBeTruthy();
			expect(
				getByText('INACTIVE_CONNECTED_WITH_SOME_DATA_INFO')
			).toBeTruthy();
		});
	});

	it('fetches a token using the connector slug when the data source is inactive', async () => {
		renderOverview({
			dataSource: buildDataSource(DataSourceStatuses.Inactive)
		});

		await waitFor(() =>
			expect(generateConnectorToken).toHaveBeenCalledWith({
				groupId: '23',
				type: 'acme'
			})
		);
	});

	it('does not fetch a token when the data source is already active', async () => {
		renderOverview({
			dataSource: buildDataSource(DataSourceStatuses.Active)
		});

		await Promise.resolve();

		expect(generateConnectorToken).not.toHaveBeenCalled();
	});

	it('shows the disconnect button when the user is admin and the data source is active', () => {
		const {getByLabelText} = renderOverview();

		expect(getByLabelText('Disconnect Data Source')).toBeTruthy();
	});

	it('hides the disconnect button when the data source is not active', () => {
		const {queryByLabelText} = renderOverview({
			dataSource: buildDataSource(DataSourceStatuses.Inactive)
		});

		expect(queryByLabelText('Disconnect Data Source')).toBeNull();
	});

	it('hides the disconnect button when the user is not an admin', () => {
		useCurrentUserMock.mockReturnValue({isAdmin: () => false});

		const {queryByLabelText} = renderOverview();

		expect(queryByLabelText('Disconnect Data Source')).toBeNull();
	});

	it('renders the configured display name as the data source type', () => {
		const config = buildConfig({displayName: 'Acme'});

		const {container} = renderOverview({config});

		const typeInput = container.querySelector(
			'#dataSourceType'
		) as HTMLInputElement | null;

		expect(typeInput).toBeTruthy();
		expect(typeInput?.value).toBe('Acme');
	});

	it('builds the endpoint URL using the window origin and config endpoint path', () => {
		const config = buildConfig({endpointPath: '/api/custom'});

		const {getAllByTestId} = renderOverview({config});

		const values = getAllByTestId('copy-input-value').map(
			node => node.textContent
		);

		expect(values).toContain(`${window.location.origin}/api/custom`);
	});
});
