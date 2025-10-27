import ClayButton from '@clayui/button';
import ClayIcon from '@clayui/icon';
import ClayLabel from '@clayui/label';
import Form from 'shared/components/form';
import getCN from 'classnames';
import Label from 'shared/components/form/Label';
import Loading, {Align} from 'shared/components/Loading';
import React, {useCallback, useRef, useState} from 'react';
import {Formik} from 'formik';
import {Text} from '@clayui/core';

export enum FontSize {
	Size1 = 1,
	Size2 = 2,
	Size3 = 3,
	Size4 = 4,
	Size5 = 5,
	Size6 = 6,
	Size7 = 7,
	Size8 = 8,
	Size9 = 9,
	Size10 = 10,
	Size11 = 11
}

interface IInputWithEditToggleProps {
	className?: string;
	dataSourceLabel?: boolean;
	editable: boolean;
	inputWidth?: number;
	isDataSourceDisconnected?: boolean;
	label?: string;
	name?: string;
	onSubmit: (value, name) => Promise<any>;
	required: boolean;
	validate: (value) => Promise<any>;
	value: string;
	valueBold?: boolean;
	valueFontSize?:
		| FontSize.Size1
		| FontSize.Size2
		| FontSize.Size3
		| FontSize.Size4
		| FontSize.Size5
		| FontSize.Size6
		| FontSize.Size7
		| FontSize.Size8
		| FontSize.Size9
		| FontSize.Size10
		| FontSize.Size11;
}

const InputWithEditToggle: React.FC<IInputWithEditToggleProps> = ({
	className,
	dataSourceLabel = false,
	editable = true,
	inputWidth,
	isDataSourceDisconnected = true,
	label,
	name = 'name',
	onSubmit,
	required = false,
	validate,
	value,
	valueBold = false,
	valueFontSize = FontSize.Size4
}) => {
	const [editing, setEditing] = useState(false);
	const formRef = useRef<Formik>(null);

	const handleSubmit = useCallback(
		values => {
			if (onSubmit && formRef.current) {
				const {resetForm, setSubmitting} = formRef.current;

				onSubmit(values[name], name)
					.then(() => {
						setSubmitting(false);
						resetForm();
						setEditing(false);
					})
					.catch(err => {
						if (!err.IS_CANCELLATION_ERROR) {
							setSubmitting(false);
						}
					});
			}
		},
		[name, onSubmit]
	);

	const handleEditToggle = useCallback(() => {
		setEditing(!editing);
	}, [editing]);

	const statusLabel = isDataSourceDisconnected
		? {displayType: 'secondary', text: Liferay.Language.get('disconnected')}
		: {displayType: 'success', text: Liferay.Language.get('connected')};

	return (
		<div
			className={getCN(
				'input-with-edit-toggle-root',
				'definition-item-root',
				className
			)}
		>
			<Form
				initialValues={{[name]: value}}
				onSubmit={handleSubmit}
				ref={formRef}
			>
				{({handleSubmit, isSubmitting, isValid, resetForm}) => (
					<Form.Form
						className='input-with-edit-toggle-editor'
						onSubmit={handleSubmit}
					>
						{dataSourceLabel && (
							<ClayLabel
								className='mb-2'
								displayType={statusLabel.displayType as any}
							>
								{statusLabel.text}
							</ClayLabel>
						)}

						{label && <Label required={required}>{label}</Label>}

						<Form.Group autoFit className='align-items-center'>
							{editing ? (
								<Form.Input
									contentAfter={
										<>
											<ClayButton
												aria-label={Liferay.Language.get(
													'cancel'
												)}
												className='button-root'
												displayType='secondary'
												onClick={() => {
													handleEditToggle();
													resetForm();
												}}
												size='sm'
											>
												<ClayIcon
													className='icon-root'
													symbol='times'
												/>
											</ClayButton>

											<ClayButton
												aria-label={Liferay.Language.get(
													'submit'
												)}
												className='button-root'
												disabled={!isValid}
												displayType='primary'
												size='sm'
												type='submit'
											>
												{isSubmitting && (
													<Loading
														align={Align.Left}
													/>
												)}

												<ClayIcon
													className='icon-root'
													symbol='check'
												/>
											</ClayButton>
										</>
									}
									disabled={!editable || isSubmitting}
									name={name}
									validate={validate}
									width={inputWidth}
								/>
							) : (
								<>
									<Text
										size={valueFontSize as any}
										weight={valueBold ? 'bold' : undefined}
									>
										{value}
									</Text>
									<ClayButton
										aria-label={Liferay.Language.get(
											'edit'
										)}
										className='button-root'
										disabled={!editable}
										displayType='secondary'
										onClick={handleEditToggle}
										size='sm'
									>
										<ClayIcon
											className='icon-root'
											symbol='pencil'
										/>
									</ClayButton>
								</>
							)}
						</Form.Group>
					</Form.Form>
				)}
			</Form>
		</div>
	);
};

export default InputWithEditToggle;
