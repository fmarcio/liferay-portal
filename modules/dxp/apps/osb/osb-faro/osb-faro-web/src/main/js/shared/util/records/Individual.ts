import {EntityTypes} from '../constants';
import {Map, Record} from 'immutable';

interface IIndividual {
	accountNames: string[] | null;
	activitiesCount: number;
	context: Map<string, any>;
	dateCreated: string;
	demographics: Map<string, any>;
	firstActivityDate: string;
	id: string;
	lastActivityDate: string;
	name: string;
	properties: Map<string, any>;
	type: EntityTypes.Individual;
}

export default class Individual
	extends Record({
		accountNames: null,
		activitiesCount: 0,
		context: Map(),
		dateCreated: null,
		demographics: Map(),
		firstActivityDate: null,
		id: null,
		lastActivityDate: null,
		name: '',
		properties: Map(),
		type: EntityTypes.Individual
	})
	implements IIndividual {
	accountNames: string[] | null;
	activitiesCount: number;
	context: Map<string, any>;
	dateCreated: string;
	demographics: Map<string, any>;
	firstActivityDate: string;
	id: string;
	lastActivityDate: string;
	name: string;
	properties: Map<string, any>;
	type: EntityTypes.Individual;

	constructor(props = {}) {
		super(props);
	}
}
