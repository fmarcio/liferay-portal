import AttributeConjunctionInput from './components/attribute-conjunction-input';
import DateFilterConjunctionInput from './components/DateFilterConjunctionInput';
import Form from 'shared/components/form';
import OccurenceConjunctionInput from './components/OccurenceConjunctionInput';
import React, {useEffect} from 'react';
import {Criterion, ISegmentEditorCustomInputBase} from '../utils/types';
import {CustomValue} from 'shared/util/records';
import {fromJS, Map} from 'immutable';
import {FunctionalOperators, RelationalOperators} from '../utils/constants';
import {
	getFilterCriterionIMap,
	getIndexFromPropertyName
} from '../utils/custom-inputs';
import {isBoolean, isNil, isNull} from 'lodash';
import {SafeResults} from 'shared/hoc/util';
import EventAttributeDefinitionsQuery, {
	EventAttributeDefinitionsData,
	EventAttributeDefinitionsVariables
} from 'event-analysis/queries/EventAttributeDefinitionsQuery';
import {useQuery} from '@apollo/react-hooks';
import {NAME} from 'shared/util/pagination';
import {OrderByDirections} from 'shared/util/constants';
import {AttributeTypes} from 'event-analysis/utils/types';

type Touched = {
	attribute: boolean;
	attributeValue: string;
	dateFilter: boolean;
	occurenceCount: boolean;
};

type Valid = {
	attribute: boolean;
	attributeValue: string;
	dateFilter: boolean;
	occurenceCount: boolean;
};

interface IEventInputProps extends ISegmentEditorCustomInputBase {
	touched: Touched;
	valid: Valid;
}

const EventInput: React.FC<IEventInputProps> = ({
	displayValue,
	id,
	onChange,
	operatorRenderer: OperatorDropdown,
	property: {entityName, id: eventDefinitionId, options, type},
	touched,
	valid,
	value: valueIMap
}) => {
	let _completedAnalytics = false;

	useEffect(() => {
		const {attributeValue, dateFilter, occurenceCount} = valid;

		const inputsValid =
			(isNil(attributeValue) || attributeValue) &&
			(isNil(dateFilter) || dateFilter) &&
			(isNil(occurenceCount) || occurenceCount);

		if (!id && inputsValid && !_completedAnalytics) {
			_completedAnalytics = true;

			analytics.track('Dynamic Segment Creation - Completed Attribute', {
				entityName,
				type
			});
		}
	}, [valid]);

	const getConjunctionDateFilterIMap = value => {
		const conjunctionDateFilterIndex = getIndexFromPropertyName(
			value,
			'day'
		);

		if (conjunctionDateFilterIndex >= 0) {
			return getFilterCriterionIMap(value, conjunctionDateFilterIndex);
		}
	};

	const handleAttributeConjunctionChange = ({
		criterion,
		touched: conjunctionTouched,
		valid: conjunctionValid
	}) => {
		onChange({
			touched: {...touched, ...conjunctionTouched},
			valid: {...valid, ...conjunctionValid},
			value: valueIMap.mergeIn(
				['criterionGroup', 'items', 1],
				fromJS(criterion)
			)
		});
	};

	const handleDateFilterConjunctionChange = criterion => {
		onChange({
			touched: {...touched, dateFilter: criterion && criterion.touched},
			valid: {...valid, dateFilter: isNull(criterion) || criterion.valid},
			value: isNull(criterion)
				? valueIMap.deleteIn(['criterionGroup', 'items', 1])
				: valueIMap.mergeIn(
						['criterionGroup', 'items', 1],
						fromJS(criterion)
				  )
		});
	};

	const handleOccurenceConjunctionChange = ({
		criterion,
		touched: occurenceCountTouched,
		valid: occurenceCountValid
	}: {
		criterion?: Criterion;
		touched?: boolean;
		valid?: boolean;
	}) => {
		let params: {touched?: Touched; valid?: Valid; value?: CustomValue} = {
			touched,
			valid
		};

		if (criterion?.operatorName) {
			params = {
				...params,
				value: valueIMap.mergeIn(
					['operator'],
					criterion.operatorName
				) as CustomValue
			};
		} else if (!isNil(criterion?.value)) {
			params = {
				...params,
				value: valueIMap.mergeIn(
					['value'],
					criterion.value
				) as CustomValue
			};
		}

		if (isBoolean(occurenceCountTouched)) {
			params = {
				...params,
				touched: {...touched, occurenceCount: occurenceCountTouched}
			};
		}

		if (isBoolean(occurenceCountValid)) {
			params = {
				...params,
				valid: {...valid, occurenceCount: occurenceCountValid}
			};
		}

		onChange(params);
	};

	const dateFilterConjunctionCriterion = (
		getConjunctionDateFilterIMap(valueIMap) || Map({propertyName: 'day'})
	).toJS();

	if (
		options.length &&
		options.some(option => option.label === 'eventHidden' && option.value)
	) {
		return (
			<div className='criteria-statement'>
				<b className='non-existent-property-message'>
					{Liferay.Language.get('custom-event-no-longer-exists')}
				</b>
			</div>
		);
	}

	// const result = useQuery<
	// 	EventAttributeDefinitionsData,
	// 	EventAttributeDefinitionsVariables
	// >(EventAttributeDefinitionsQuery, {
	// 	variables: {
	// 		eventDefinitionId,
	// 		keyword: '',
	// 		page: 0,
	// 		size: 25,
	// 		sort: {
	// 			column: NAME,
	// 			type: OrderByDirections.Ascending
	// 		},
	// 		type: AttributeTypes.All
	// 	}
	// });

	const mockAttributes = [
		{
			dataType: 'STRING',
			displayName: 'teste',
			encodedName: 'testeEncoded',
			id: '123',
			name: 'TESTE',
			type: 'GLOBAL'
		}
	];

	const result = {
		data: {
			eventAttributeDefinitions: {
				eventAttributeDefinitions: [
					{
						dataType: 'STRING',
						description: null,
						displayName: 'canonicalUrl',
						encodedName: 'canonicalUrlENCODED',
						id: '10',
						name: 'canonicalUrl',
						sampleValue: 'http://localhost:7400',
						type: 'GLOBAL',
						__typename: 'EventAttributeDefinition'
					},
					{
						dataType: 'STRING',
						description: null,
						displayName: 'pageDescription',
						encodedName: 'pageDescriptionENCODED',
						id: '24',
						name: 'pageDescription',
						sampleValue: '',
						type: 'GLOBAL',
						__typename: 'EventAttributeDefinition'
					},
					{
						dataType: 'STRING',
						description: null,
						displayName: 'pageKeywords',
						encodedName: 'pageKeywordsENCODED',
						id: '25',
						name: 'pageKeywords',
						sampleValue: '',
						type: 'GLOBAL',
						__typename: 'EventAttributeDefinition'
					},
					{
						dataType: 'STRING',
						description: null,
						displayName: 'pageTitle',
						encodedName: 'pageTitleENCODED',
						id: '26',
						name: 'pageTitle',
						sampleValue: 'Home - Liferay',
						type: 'GLOBAL',
						__typename: 'EventAttributeDefinition'
					},
					{
						dataType: 'STRING',
						description: null,
						displayName: 'referrer',
						encodedName: 'referrerENCODED',
						id: '28',
						name: 'referrer',
						sampleValue:
							'http://localhost:7400/group/control_panel/manage?p_p_id=com_liferay_configuration_admin_web_portlet_InstanceSettingsPortlet&p_p_lifecycle=0&p_p_state=maximized&p_p_mode=view&_com_liferay_configuration_admin_web_portlet_InstanceSettingsPortlet_mvcRenderCommandName=%2Fconfiguration_admin%2Fview_configuration_screen&_com_liferay_configuration_admin_web_portlet_InstanceSettingsPortlet_configurationScreenKey=2-synced-contact-data',
						type: 'GLOBAL',
						__typename: 'EventAttributeDefinition'
					},
					{
						dataType: 'STRING',
						description: null,
						displayName: 'url',
						encodedName: 'urlENCODED',
						id: '35',
						name: 'url',
						sampleValue: 'http://localhost:7400/web/guest',
						type: 'GLOBAL',
						__typename: 'EventAttributeDefinition'
					},
					{
						dataType: 'STRING',
						description: null,
						displayName: 'alalala lalla',
						encodedName: 'alallaENCODED',
						id: '39',
						name: 'url',
						sampleValue: 'http://localhost:7400/web/guest',
						type: 'GLOBAL',
						__typename: 'EventAttributeDefinition'
					}
				],
				total: 6,
				__typename: 'EventAttributeDefinitionBag'
			}
		},
		loading: false,
		error: false
	};

	// console.log('result: ', result);

	return (
		<div className='criteria-statement'>
			<SafeResults {...result} page={false} pageDisplay={false}>
				{data => {
					const attributes =
						data?.eventAttributeDefinitions
							?.eventAttributeDefinitions || [];

					return (
						<>
							<Form.Group autoFit>
								<Form.GroupItem
									className='font-weight-semibold text-secondary'
									label
									shrink
								>
									{Liferay.Language.get('individual')}
								</Form.GroupItem>

								<OperatorDropdown />

								<Form.GroupItem
									className='entity-name'
									label
									shrink
								>
									{Liferay.Language.get('performed-fragment')}
								</Form.GroupItem>

								<Form.GroupItem
									className='display-value'
									label
									shrink
								>
									<b>{displayValue}</b>
								</Form.GroupItem>

								<OccurenceConjunctionInput
									onChange={handleOccurenceConjunctionChange}
									operatorName={
										valueIMap.get(
											'operator'
										) as FunctionalOperators &
											RelationalOperators
									}
									touched={touched.occurenceCount}
									valid={valid.occurenceCount}
									value={valueIMap.get('value')}
								/>

								<DateFilterConjunctionInput
									conjunctionCriterion={
										dateFilterConjunctionCriterion
									}
									onChange={handleDateFilterConjunctionChange}
								/>
							</Form.Group>

							{!!attributes.length && (
								<Form.Group autoFit>
									<Form.GroupItem
										className='conjunction'
										label
										shrink
									>
										{Liferay.Language.get('where-fragment')}
									</Form.GroupItem>

									<AttributeConjunctionInput
										attributes={attributes}
										conjunctionCriterion={getFilterCriterionIMap(
											valueIMap,
											1
										).toJS()}
										onChange={
											handleAttributeConjunctionChange
										}
										touched={{
											attribute: touched.attribute,
											attributeValue:
												touched.attributeValue
										}}
										valid={{
											attribute: valid.attribute,
											attributeValue: valid.attributeValue
										}}
									/>
								</Form.Group>
							)}
						</>
					);
				}}
			</SafeResults>
		</div>
	);
};

export default EventInput;
