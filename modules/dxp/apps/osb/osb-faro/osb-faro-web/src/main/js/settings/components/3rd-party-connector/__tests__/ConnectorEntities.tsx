jest.unmock('react-dom');

import ConnectorEntities from '../ConnectorEntities';
import React from 'react';
import {ConnectorEntityDescriptor} from '../types';
import {render} from '@testing-library/react';

const buildEntity = (
	overrides: Partial<ConnectorEntityDescriptor> = {}
): ConnectorEntityDescriptor => ({
	accessor: 'contacts',
	description: 'Contact records',
	icon: 'users',
	label: 'Contacts',
	...overrides
});

describe('ConnectorEntities', () => {
	it('renders one item per entity with its label and description', () => {
		const entities = [
			buildEntity({accessor: 'a', description: 'desc-a', label: 'A'}),
			buildEntity({accessor: 'b', description: 'desc-b', label: 'B'})
		];

		const {getByText} = render(
			<ConnectorEntities
				connectionStatus='configured'
				entities={entities}
				syncedCounts={{}}
			/>
		);

		expect(getByText('A')).toBeTruthy();
		expect(getByText('B')).toBeTruthy();
		expect(getByText('desc-a')).toBeTruthy();
		expect(getByText('desc-b')).toBeTruthy();
	});

	it('renders the synced count when it is a non-negative number', () => {
		const {getByText} = render(
			<ConnectorEntities
				connectionStatus='configured'
				entities={[buildEntity()]}
				syncedCounts={{contacts: 42}}
			/>
		);

		expect(getByText(/42/)).toBeTruthy();
	});

	it('renders the synced count when it is zero', () => {
		const {getByText} = render(
			<ConnectorEntities
				connectionStatus='configured'
				entities={[buildEntity()]}
				syncedCounts={{contacts: 0}}
			/>
		);

		expect(getByText(/0/)).toBeTruthy();
	});

	it('hides the synced count when no value is provided', () => {
		const {queryByText} = render(
			<ConnectorEntities
				connectionStatus='configured'
				entities={[buildEntity()]}
				syncedCounts={{}}
			/>
		);

		expect(queryByText(/Items Synced/i)).toBeNull();
	});

	it('renders the configured label with success display when status is configured', () => {
		const {getByText} = render(
			<ConnectorEntities
				connectionStatus='configured'
				entities={[buildEntity()]}
				syncedCounts={{}}
			/>
		);

		expect(getByText('Configured')).toBeTruthy();
	});

	it('renders the unconfigured label when status is unconfigured', () => {
		const {getByText} = render(
			<ConnectorEntities
				connectionStatus='unconfigured'
				entities={[buildEntity()]}
				syncedCounts={{}}
			/>
		);

		expect(getByText('Unconfigured')).toBeTruthy();
	});

	it('renders nothing inside the list when no entities are provided', () => {
		const {container} = render(
			<ConnectorEntities
				connectionStatus='configured'
				entities={[]}
				syncedCounts={{}}
			/>
		);

		expect(container.querySelectorAll('.list-group-item')).toHaveLength(0);
	});
});
