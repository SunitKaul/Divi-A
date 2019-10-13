import { Component } from '@wordpress/element';

import { BorderRadius } from '../../../index';

class ControlBorderRadius extends Component {
	constructor() {
		super( ...arguments );

		this.onChange = this.onChange.bind( this );
	}

	onChange( value, corner, linked ) {
		const { data, setAttributes, disabled } = this.props;

		const valueAsInt = parseInt( value, 10 );
		if ( linked ) {
			const newBorderRadius = {};

			[ 'topLeft', 'topRight', 'bottomLeft', 'bottomRight' ].map( ( keyCorner ) => {
				if ( ! disabled || ! disabled[ keyCorner ] ) {
					newBorderRadius[ keyCorner ] = valueAsInt;
				}
			} );

			setAttributes( { borderRadius: newBorderRadius } );
		} else {
			setAttributes( { borderRadius: { ...data.borderRadius, [ corner ]: valueAsInt } } );
		}
	}

	render() {
		const { data, disabled } = this.props;

		return (
			<BorderRadius borderRadius={ data.borderRadius } onChange={ this.onChange } disabled={ disabled || {} } />
		);
	}
}

ControlBorderRadius.defaultProps = {
	disabled: {},
};

export default ControlBorderRadius;
