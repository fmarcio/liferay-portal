import React from 'react';
import {render} from '@testing-library/react';

jest.unmock('react-dom');

global.Liferay = {
	Language: {
		get: key => key
	}
};

const mockedResponse = {
	averageSegmentMembershipDuration: {
		trend: {
			classification: 'POSITIVE',
			percentage: 0.8
		},
		value: 556231231
	},
	entryRate: {
		trend: {
			classification: 'POSITIVE',
			percentage: 0.5
		},
		value: 5511
	},
	exitRate: {
		trend: {
			classification: 'NEGATIVE',
			percentage: -0.3
		},
		value: 10111
	},
	totalMembers: {
		totalIndividuals: 1500000,
		trend: {
			classification: 'POSITIVE',
			percentage: 0.2
		},
		value: 2211
	}
};

describe('MembershipMetrics', () => {
	it('should render', () => {
		jest.isolateModules(() => {
			jest.doMock('shared/hooks/useRequest', () => ({
				useRequest: jest.fn(() => ({
					data: mockedResponse
				}))
			}));

			jest.doMock('react-router-dom', () => ({
				...jest.requireActual('react-router-dom'),
				useParams: () => ({
					groupId: '123',
					id: '456'
				})
			}));

			const MembershipMetrics = require('../MembershipMetrics').default;

			const {container} = render(<MembershipMetrics />);

			expect(container).toMatchSnapshot();
		});
	});
});
