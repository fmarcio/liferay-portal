import React, { useContext, useEffect, useState } from 'react';

import ApiHelper from '../../../services/ApiHelper';
import { ViewDashboardContext } from '../ViewDashboardContext';
import { buildQueryString } from '../utils/buildQueryString';
import { FilterDropdown } from './FilterDropdown';
import { IAllFiltersDropdown } from './InventoryAnalysisCard';

type TItemProps = {
	count: number;
    key: string;
    title: string;
}
export interface IStructureProps {
	totalCount: number;
  		items: TItemProps[]; 
}

interface IGroupByDropdown extends IAllFiltersDropdown {
	setStructureTypeData: (value: IStructureProps) => void;
}

const GroupByDropdown:React.FC<IGroupByDropdown> = ({
	className,
	item,
	onSelectItem,
	setStructureTypeData,
}) => {
	const {
		filters: {space},
	} = useContext(ViewDashboardContext);

	const structureTypes = [
		{
			label: Liferay.Language.get('category'),
			value: 'category',
		},
		{
			label: Liferay.Language.get('vocabulary'),
			value: 'vocabulary',
		},
		{
			label: Liferay.Language.get('tag'),
			value: 'tag',
		},
		{
			label: Liferay.Language.get('structure-label'),
			value: 'structure',
		},
	];

	const [dropdownActive, setDropdownActive] = useState(false); //se o dropdown esta ativo :)

	const fetchStructureTypes = async (value: string) => {
		const queryParams = buildQueryString({
				spaceId: space.value,
				groupBy: value
		})

		const endpoint =`/o/analytics-cms-rest/v1.0/inventory-analysis${queryParams}`;

		const {data, error} = await ApiHelper.get<IStructureProps>(
				`${endpoint}${queryParams}`
			);

			if (data) {
				setStructureTypeData({...data});
			}

			if (error) {
				console.error(error);
			}
	}

	useEffect(() => {
		if (item?.value) {
			fetchStructureTypes(item.value);
		}
	}, []);

	const handleSelect = (newItem: { label: string; value: string }) => {
		onSelectItem(newItem);

		setDropdownActive(false); //para trocar para o novo valor

		fetchStructureTypes(newItem.value); 
	};

	return (
	<FilterDropdown
		active={dropdownActive}
		className={className}
		filterByValue="structureTypes"
		items={structureTypes}
		loading={false}
		onActiveChange={() => setDropdownActive(!dropdownActive)}
		onSelectItem={handleSelect}
		selectedItem={item}
	/>
);
};

export { GroupByDropdown };
