// External dependencies
import PropTypes from 'prop-types';

// WordPress dependencies
import { Component, Fragment } from '@wordpress/element';
import {
	RangeControl,
	ToggleControl,
	PanelRow,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

// Internal dependencies
import './scss/edit.scss';
import ColorPicker from '../color-picker/component';
import { getNumberOr } from '../../../utils';

class BoxShadow extends Component {
	constructor() {
		super( ...arguments );

		this.renderRange = this.renderRange.bind( this );

		this.preSaveValues = {
			color: this.props.color,
			horizontal: this.props.horizontal,
			vertical: this.props.vertical,
			blur: this.props.blur,
			spread: this.props.spread,
		};
	}

	renderRange( label, tag, callback, min = -200, max = 200 ) {
		return (
			<RangeControl
				label={ label }
				value={ getNumberOr( this.props[ tag ] ) }
				onChange={ ( val ) => callback( val ) }
				min={ min }
				max={ max }
			/>
		);
	}

	render() {
		return (
			<Fragment>
				<PanelRow>
					<ToggleControl checked={ this.props.enabled } onChange={ this.props.onChange } label={ this.props.label } />
				</PanelRow>

				{ this.props.enabled &&
				<Fragment>
					<ColorPicker color={ this.props.color } onChange={ this.props.onChangeColor } />

					{ this.renderRange( __( 'Horizontal', 'wpv-views' ), 'horizontal', this.props.onChangeHorizontal ) }
					{ this.renderRange( __( 'Vertical', 'wpv-views' ), 'vertical', this.props.onChangeVertical ) }
					{ this.renderRange( __( 'Blur', 'wpv-views' ), 'blur', this.props.onChangeBlur, 0 ) }
					{ this.props.onChangeSpread && this.renderRange( __( 'Spread', 'wpv-views' ), 'spread', this.props.onChangeSpread ) }
				</Fragment>
				}
			</Fragment>

		);
	}
}

BoxShadow.defaultProps = {
	enabled: false,
	label: __( 'Box Shadow', 'wpv-views' ),
	color: { hex: '#000000', rgb: { r: 0, g: 0, b: 0, a: 0.5 } },
	horizontal: 5,
	vertical: 5,
	blur: 10,
	spread: 0,
};

BoxShadow.propTypes = {
	enabled: PropTypes.bool,
	color: PropTypes.object,
	horizontal: PropTypes.number,
	vertical: PropTypes.number,
	blur: PropTypes.number,
	spread: PropTypes.number,
	onChange: PropTypes.func.isRequired,
	onChangeColor: PropTypes.func.isRequired,
	onChangeHorizontal: PropTypes.func.isRequired,
	onChangeVertical: PropTypes.func.isRequired,
	onChangeBlur: PropTypes.func.isRequired,
	onChangeSpread: PropTypes.func,
};

export default BoxShadow;
