// WordPress dependencies
import { __ } from '@wordpress/i18n';
import { Component } from '@wordpress/element';

// Internal dependencies
import { BoxShadow } from '../../../../index';

export default class extends Component {
	constructor() {
		super( ...arguments );

		this.onChangeTextShadow = this.onChangeTextShadow.bind( this );
		this.onChangeTextShadowColor = this.onChangeTextShadowColor.bind( this );
		this.onChangeTextShadowHorizontal = this.onChangeTextShadowHorizontal.bind( this );
		this.onChangeTextShadowVertical = this.onChangeTextShadowVertical.bind( this );
		this.onChangeTextShadowBlur = this.onChangeTextShadowBlur.bind( this );
	}

	onChangeTextShadow( enabled ) {
		const { setAttributes, data } = this.props;
		setAttributes( { textShadow: { ...data.textShadow, enabled } } );
	}

	onChangeTextShadowColor( color ) {
		const { setAttributes, data } = this.props;
		setAttributes( { textShadow: { ...data.textShadow, color } } );
	}

	onChangeTextShadowHorizontal( value ) {
		const { setAttributes, data } = this.props;
		setAttributes( { textShadow: { ...data.textShadow, horizontal: parseInt( value, 10 ) } } );
	}

	onChangeTextShadowVertical( value ) {
		const { setAttributes, data } = this.props;
		setAttributes( { textShadow: { ...data.textShadow, vertical: parseInt( value, 10 ) } } );
	}

	onChangeTextShadowBlur( value ) {
		const { setAttributes, data } = this.props;
		setAttributes( { textShadow: { ...data.textShadow, blur: parseInt( value, 10 ) } } );
	}

	render() {
		const { data } = this.props;

		const textShadow = data.textShadow || {};

		return (
			<BoxShadow
				label={ __( 'Text Shadow', 'wpv-views' ) }
				enabled={ textShadow.enabled }
				color={ textShadow.color }
				horizontal={ textShadow.horizontal }
				vertical={ textShadow.vertical }
				blur={ textShadow.blur }
				onChange={ this.onChangeTextShadow }
				onChangeColor={ this.onChangeTextShadowColor }
				onChangeHorizontal={ this.onChangeTextShadowHorizontal }
				onChangeVertical={ this.onChangeTextShadowVertical }
				onChangeBlur={ this.onChangeTextShadowBlur }
			/>
		);
	}
}
