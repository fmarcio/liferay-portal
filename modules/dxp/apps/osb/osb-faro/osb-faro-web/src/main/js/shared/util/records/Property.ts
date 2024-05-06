import {PropertyTypes} from 'segment/segment-editor/dynamic/utils/constants';
import {Record} from 'immutable';

interface IProperty {
	encodedName?: string;
	entityName: string;
	entityType?: string;
	id?: string;
	label: string;
	name: string;
	options?: {label: string; value: string | boolean}[];
	propertyKey: string;
	type: PropertyTypes;
}

export default class Property
	extends Record({
		encodedName: '',
		entityName: '',
		entityType: '',
		id: null,
		label: '',
		name: '',
		options: [],
		propertyKey: '',
		type: null
	})
	implements IProperty {
	encodedName?: string;
	entityName: string;
	entityType: string;
	id: string;
	label: string;
	name: string;
	options?: {label: string; value: string | boolean}[];
	propertyKey: string;
	type: PropertyTypes;

	constructor(props: IProperty) {
		super(props);
	}
}
