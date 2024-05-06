import Form from 'shared/components/form';
import OperatorSelect from './OperatorSelect';
import React, {useEffect} from 'react';
import ValueInput from './ValueInput';
import {
	AddEntity,
	EntityType,
	ReferencedEntities,
	withReferencedObjectsConsumer
} from '../../../context/referencedObjects';
import {Attribute} from 'event-analysis/utils/types';
import {Criterion} from '../../../utils/types';
import {
	getDefaultAttributeOperator,
	getDefaultAttributeValue,
	validateAttributeValue
} from './utils';
import {Map} from 'immutable';
import {Option, Picker} from '@clayui/core';

interface IAttributeFilterConjunctionInputProps {
	addEntity: AddEntity;
	attributes: Attribute[];
	conjunctionCriterion: Criterion;
	onChange: (params: {
		criterion: Criterion;
		touched: {
			attribute: boolean;
			attributeValue: boolean;
		};
		valid: {
			attribute: boolean;
			attributeValue: boolean;
		};
	}) => void;
	referencedEntities: ReferencedEntities;
	touched: {
		attribute: boolean;
		attributeValue: boolean;
	};
	valid: {
		attribute: boolean;
		attributeValue: boolean;
	};
}

const AttributeFilterConjunctionInput: React.FC<IAttributeFilterConjunctionInputProps> = ({
	addEntity,
	attributes,
	conjunctionCriterion,
	onChange,
	referencedEntities,
	touched,
	valid
}) => {
	useEffect(() => {
		if (!getAttributeEncodedName()) {
			const defaultAttribute = attributes[0];

			setAttribute(defaultAttribute);
		}
	}, []);

	// ORIGINAL
	// const getAttributeFromContext = () => {
	// 	const attributeId = getAttributId();

	// 	return referencedEntities
	// 		.getIn([EntityType.Attributes, attributeId], Map({}))
	// 		.toJS();
	// };

	const getAttributeFromContext = () => {
		const attributeEncodedName = getAttributeEncodedName();

		return referencedEntities
			.getIn([EntityType.Attributes, attributeEncodedName], Map({}))
			.toJS();
	};

	const getAttributeEncodedName = (): string => {
		const [, encodedName] = conjunctionCriterion.propertyName.split('/');

		return encodedName;
	};

	const handleAttributeChange = value => {
		const attribute = attributes.find(
			({encodedName}) => encodedName === value
		);

		setAttribute(attribute);
	};

	const setAttribute = (attribute: Attribute) => {
		addEntity({
			entityType: EntityType.Attributes,
			payload: Map({...attribute, eventType: 'customEvent'})
		});

		const defaultAttributeValue = getDefaultAttributeValue(
			attribute.dataType,
			conjunctionCriterion.operatorName
		);

		const defaultAttributeOperator = getDefaultAttributeOperator(
			attribute.dataType
		);

		onChange({
			criterion: {
				operatorName: defaultAttributeOperator as Criterion['operatorName'],
				propertyName: `attribute/${attribute.encodedName}`,
				value: defaultAttributeValue
			},
			touched: {...touched, attribute: true, attributeValue: false},
			valid: {
				...valid,
				attribute: true,
				attributeValue: validateAttributeValue(
					defaultAttributeValue,
					attribute.dataType,
					defaultAttributeOperator
				)
			}
		});
	};

	const {dataType} = getAttributeFromContext();
	const {operatorName, value} = conjunctionCriterion;

	return (
		<>
			<Form.GroupItem shrink>
				<Picker
					className='attribute-input'
					items={attributes.map(
						({displayName, encodedName, name}) => ({
							label: displayName || name,
							value: encodedName
						})
					)}
					onSelectionChange={handleAttributeChange}
					selectedKey={getAttributeEncodedName()}
				>
					{({label, value}) => <Option key={value}>{label}</Option>}
				</Picker>
			</Form.GroupItem>

			<OperatorSelect
				dataType={dataType}
				onChange={onChange}
				operatorName={operatorName}
			/>

			<ValueInput
				dataType={dataType}
				onChange={onChange}
				operatorName={operatorName}
				touched={touched.attributeValue}
				valid={valid.attributeValue}
				value={value}
			/>
		</>
	);
};

export default withReferencedObjectsConsumer(AttributeFilterConjunctionInput);
