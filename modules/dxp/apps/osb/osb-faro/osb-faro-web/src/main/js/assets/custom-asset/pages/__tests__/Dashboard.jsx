// TESTE DIDI

import client from 'shared/apollo/client';
import React from 'react';
import {ApolloProvider} from '@apollo/react-hooks';
import {CustomAssetsDashboardPage} from '../Dashboard';
import {render} from '@testing-library/react';
import {StaticRouter} from 'react-router';
import mockStore from 'test/mock-store';
import {Provider} from 'react-redux';

jest.unmock('react-dom');

const WrapperComponent = () => (
	<Provider sore={mockStore()}>
		<ApolloProvider client={client}>
			<StaticRouter>
				<CustomAssetsDashboardPage
					addAlert={() => {}}
					channelId='12345'
					currentUser={{}}
					definition='test'
					groupId='1234'
					mutate={() => {}}
					router={{
						params: {
							groupId: '1234',
							channelId: '56789',
							id: '123',
							touchpoint: 'Any',
							title: 'Custom20Asset%20Analytics%20Cloud'
						},
						query: {
							rangeKey: '30'
						}
					}}
				/>
			</StaticRouter>
		</ApolloProvider>
	</Provider>
);

describe('CustomAssetsDashboardPage', () => {
	it('renders component', () => {
		const {container} = render(<WrapperComponent />);

		expect(container).toMatchSnapshot();
	});
});

// CHAT GPT 1

// import React from 'react';
// import {render} from '@testing-library/react';
// import {CustomAssetsDashboardPage} from '../Dashboard';
// import {ChannelContext} from 'shared/context/channel';
// import {mockChannelContext} from 'test/mock-channel-context';
// import customAssetQuery from 'shared/queries/custom-asset-query';
// import {StaticRouter} from 'react-router';
// import ApolloClient from 'apollo-client';
// import {ApolloProvider} from '@apollo/react-hooks';

// const OPA = {
// 	data: {
// 		dashboards: {
// 			dashboards: [
// 				{
// 					id:
// 						'9fd6e947aa1388f28ef5f91b78047cb9605f257dd0f82762c6f6cfa26bb66c6e',
// 					assetId: 'analytics-portal',
// 					assetTitle: 'Custom Asset Analytics Cloud',
// 					createDate: '2024-12-16T18:16:12.480',
// 					modifiedByUserName: null,
// 					modifiedDate: null,
// 					__typename: 'Dashboard'
// 				},
// 				{
// 					id:
// 						'dc70568a017e8b1134615181434dcee30901034b6efac0a8be33ded32900dfc4',
// 					assetId: 'favorite-food-poll',
// 					assetTitle: 'What is your favorite food Poll',
// 					createDate: '2024-12-16T18:14:39.263',
// 					modifiedByUserName: null,
// 					modifiedDate: null,
// 					__typename: 'Dashboard'
// 				}
// 			],
// 			total: 2,
// 			__typename: 'DashboardBag'
// 		}
// 	},
// 	loading: false,
// 	networkStatus: 7,
// 	stale: false
// };

// const CustomAssetsDashboardQueryMock = {
// 	data: {
// 		dashboard: {
// 			assetId: 'analytics-portal',
// 			assetTitle: 'Custom Asset Analytics Cloud',
// 			category: 'AC',
// 			createDate: '2024-12-16T22:46:42.066',
// 			definition: null,
// 			id:
// 				'9fd6e947aa1388f28ef5f91b78047cb9605f257dd0f82762c6f6cfa26bb66c6e',
// 			modifiedByUserName: null,
// 			modifiedDate: null,
// 			__typename: 'Dashboard'
// 		}
// 	},
// 	loading: false,
// 	networkStatus: 7,
// 	stale: false
// };

// describe('CustomAssetsDashboardPage', () => {
// 	it('should render without crashing', () => {
// 		const mockAddAlert = jest.fn();

// 		const mockMutate = jest.fn().mockResolvedValueOnce({});

// 		const mockRouter = {
// 			params: {
// 				groupId: '34074',
// 				channelId: '725327954986677299',
// 				id: '9fd6e947a',
// 				touchpoint: 'Any',
// 				title: 'Custom Asset Analytics Cloud'
// 			},
// 			query: {
// 				rangeKey: '30'
// 			}
// 		};
// 		const mockCurrentUser = {
// 			emailAddress: 'test@liferay.com',
// 			groupId: 34074,
// 			id: 34075,
// 			languageId: 'en_US',
// 			name: 'Test Test',
// 			roleName: 'Site Owner',
// 			screenName: 'test',
// 			status: 0,
// 			userId: 20123
// 		};

// 		const mockContext = {
// 			selectedChannel: {
// 				id: '123456',
// 				name: 'Test Channel'
// 			}
// 		};

// 		const {debug, container} = render(
// 			<ChannelContext.Provider value={mockChannelContext()}>
// 				<StaticRouter>
// 					<CustomAssetsDashboardPage
// 						addAlert={mockAddAlert}
// 						currentUser={mockCurrentUser}
// 						definition=''
// 						mutate={() => {}}
// 						router={mockRouter}
// 					/>
// 				</StaticRouter>
// 			</ChannelContext.Provider>
// 		);

// 		debug();
// 	});
// });
