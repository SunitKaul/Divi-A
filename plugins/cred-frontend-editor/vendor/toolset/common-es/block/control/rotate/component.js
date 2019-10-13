// External dependencies
import PropTypes from 'prop-types';

// WordPress dependencies
import { Component } from '@wordpress/element';
import { RangeControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

// Internal Dependencies
import { getNumberOr } from '../../../utils';

class Rotate extends Component {
	render() {
		const { label, value, onChange, min, max } = this.props;

		return (
			<RangeControl
				label={ label }
				value={ getNumberOr( value ) }
				onChange={ onChange }
				min={ min }
				max={ max }
			/>
		);
	}
}

Rotate.defaultProps = {
	label: __( 'Rotate', 'wpv-views' ),
	value: undefined,
	min: -180,
	max: 180,
};

Rotate.propTypes = {
	label: PropTypes.string,
	value: PropTypes.number,
	min: PropTypes.number,
	max: PropTypes.number,
	onChange: PropTypes.func.isRequired,
};

export default Rotate;
