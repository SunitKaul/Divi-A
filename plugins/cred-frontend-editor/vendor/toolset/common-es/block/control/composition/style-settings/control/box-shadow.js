// WordPress dependencies
import { __ } from '@wordpress/i18n';
import { Component } from '@wordpress/element';

// Internal dependencies
import { BoxShadow } from '../../../index';

export default class extends Component {
	constructor() {
		super( ...arguments );

		this.onChangeBoxShadow = this.onChangeBoxShadow.bind( this );
		this.onChangeBoxShadowColor = this.onChangeBoxShadowColor.bind( this );
		this.onChangeBoxShadowHorizontal = this.onChangeBoxShadowHorizontal.bind( this );
		this.onChangeBoxShadowVertical = this.onChangeBoxShadowVertical.bind( this );
		this.onChangeBoxShadowBlur = this.onChangeBoxShadowBlur.bind( this );
		this.onChangeBoxShadowSpread = this.onChangeBoxShadowSpread.bind( this );
	}

	onChangeBoxShadow( enabled ) {
		const { setAttributes, data } = this.props;
		setAttributes( { boxShadow: { ...data.boxShadow, enabled } } );
	}

	onChangeBoxShadowColor( color ) {
		const { setAttributes, data } = this.props;
		setAttributes( { boxShadow: { ...data.boxShadow, color } } );
	}

	onChangeBoxShadowHorizontal( value ) {
		const { setAttributes, data } = this.props;
		setAttributes( { boxShadow: { ...data.boxShadow, horizontal: parseInt( value, 10 ) } } );
	}

	onChangeBoxShadowVertical( value ) {
		const { setAttributes, data } = this.props;
		setAttributes( { boxShadow: { ...data.boxShadow, vertical: parseInt( value, 10 ) } } );
	}

	onChangeBoxShadowBlur( value ) {
		const { setAttributes, data } = this.props;
		setAttributes( { boxShadow: { ...data.boxShadow, blur: parseInt( value, 10 ) } } );
	}

	onChangeBoxShadowSpread( value ) {
		const { setAttributes, data } = this.props;
		setAttributes( { boxShadow: { ...data.boxShadow, spread: parseInt( value, 10 ) } } );
	}

	render() {
		const { data } = this.props;

		const boxShadow = data.boxShadow || {};

		return (
			<BoxShadow
				label={ __( 'Box Shadow', 'wpv-views' ) }
				enabled={ boxShadow.enabled }
				color={ boxShadow.color }
				horizontal={ boxShadow.horizontal }
				vertical={ boxShadow.vertical }
				blur={ boxShadow.blur }
				spread={ boxShadow.spread }
				onChange={ this.onChangeBoxShadow }
				onChangeColor={ this.onChangeBoxShadowColor }
				onChangeHorizontal={ this.onChangeBoxShadowHorizontal }
				onChangeVertical={ this.onChangeBoxShadowVertical }
				onChangeBlur={ this.onChangeBoxShadowBlur }
				onChangeSpread={ this.onChangeBoxShadowSpread }
			/>
		);
	}
}
