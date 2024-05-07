import {DataTypes} from 'event-analysis/utils/types';
import {gql} from 'apollo-boost';
import {Sort} from 'shared/types';

export type Property = {
	dataType: DataTypes;
	displayName?: string;
	id: string;
	name: string;
};

export interface EventPropertiesData {
	eventProperties: Property[];
	total: number;
}

export interface EventPropertiesVariables {
	eventDefinitionId?: string;
	keyword?: string;
	page?: number;
	size: number;
	sort: Sort;
}

export default gql`
	query EventProperties(
		$eventDefinitionId: String!
		$keyword: String
		$page: Int!
		$size: Int!
		$sort: Sort!
	) {
		eventProperties(
			eventDefinitionId: $eventDefinitionId
			keyword: $keyword
			page: $page
			size: $size
			sort: $sort
		) {
			eventProperties {
				dataType
				displayName
				id
				name
				__typename
			}
			total
			__typename
		}
	}
`;
