import {gql} from 'apollo-boost';

export default gql`
	query EventProperties(
		$eventDefinitionId: String!,
		$keyword: String,
		$page: Int!,
		$size: Int!,
		$sort: Sort!
	) {
  		eventProperties(
			eventDefinitionId: $eventDefinitionId,
			keyword: $keyword,
			page: $page,
			size: $size,
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
