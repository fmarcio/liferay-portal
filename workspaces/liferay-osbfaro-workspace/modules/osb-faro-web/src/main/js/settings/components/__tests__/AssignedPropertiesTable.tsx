jest.unmock('react-dom');

import * as data from 'test/data';
import mockStore from 'test/mock-store';
import React from 'react';
import {AssignedPropertiesTable} from '../AssignedPropertiesTable';
import {DataSource} from 'shared/util/records';
import {DataSourceStatuses} from 'shared/util/constants';
import {MemoryRouter, Route} from 'react-router-dom';
import {Provider} from 'react-redux';
import {render, screen} from '@testing-library/react';
import {useRequest} from 'shared/hooks/useRequest';

jest.mock('shared/hooks/useRequest', () => ({
	useRequest: jest.fn(),
}));

const mockUseRequest = useRequest as jest.Mock;

const WrappedComponent = ({
	editable,
	status = DataSourceStatuses.Active,
}: {
	editable: boolean;
	status?: string;
}) => (
	<Provider store={mockStore()}>
		<MemoryRouter
			initialEntries={['/workspace/23/settings/data-source/test']}
		>
			<Route path="/workspace/:groupId/settings/data-source/:id">
				<AssignedPropertiesTable
					addAlert={jest.fn()}
					close={jest.fn()}
					dataSource={data.getImmutableMock(
						DataSource,
						(seed: number) => ({
							...data.mockMarketoCampaignDataSource(seed),
							status,
						})
					)}
					editable={editable}
					handleUpdateDataSource={jest.fn()}
					open={jest.fn()}
					updateDataSourceFn={jest.fn()}
				/>
			</Route>
		</MemoryRouter>
	</Provider>
);

const getRadios = () => ({
	enableAllChannels: screen.getByLabelText(
		'Make individual data from this data source available in all properties, including those not yet created.'
	),
	selectProperties: screen.getByLabelText('Select Properties'),
});

const querySelectPropertyButton = () =>
	screen.queryByRole('button', {name: 'Select Property'});

describe('AssignedPropertiesTable', () => {
	beforeEach(() => {
		mockUseRequest.mockReturnValue({
			data: {items: [], total: 0},
			loading: false,
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('allows editing the property selection and enabling all channels when editable is true', () => {
		render(<WrappedComponent editable />);

		const {enableAllChannels, selectProperties} = getRadios();

		expect(enableAllChannels).toBeEnabled();
		expect(selectProperties).toBeEnabled();
		expect(querySelectPropertyButton()).toBeTruthy();
	});

	it('prevents editing the property selection and enabling all channels when editable is false', () => {
		render(<WrappedComponent editable={false} />);

		const {enableAllChannels, selectProperties} = getRadios();

		expect(enableAllChannels).toBeDisabled();
		expect(selectProperties).toBeDisabled();
		expect(querySelectPropertyButton()).toBeNull();
	});

	it('prevents editing an inactive data source even when editable is true', () => {
		render(
			<WrappedComponent editable status={DataSourceStatuses.Inactive} />
		);

		const {enableAllChannels, selectProperties} = getRadios();

		expect(enableAllChannels).toBeDisabled();
		expect(selectProperties).toBeDisabled();
	});
});
