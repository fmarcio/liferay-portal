import Button from 'shared/components/Button';
import ClayIcon from '@clayui/icon';
import PropTypes from 'prop-types';
import React from 'react';

interface BackButtonIProps {
	href: string;
	label: string;
}

export default class BackButton extends React.Component<BackButtonIProps> {
	static propTypes = {
		href: PropTypes.string.isRequired,
		label: PropTypes.string.isRequired
	};

	render() {
		const {href, label} = this.props;

		return (
			<div className='back-button-root'>
				<Button borderless display='secondary' href={href} outline>
					<ClayIcon
						className='icon-root icon-size-sm inline-item inline-item-before'
						symbol='angle-left'
					/>

					{label}
				</Button>
			</div>
		);
	}
}
