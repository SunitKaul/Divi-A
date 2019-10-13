import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { RangeControl } from '@wordpress/components';

export default class extends Component {
	render() {
		const { data, setAttributes } = this.props;

		return (
			<RangeControl
				label={ __( 'z-index', 'wpv-views' ) }
				value={ data.zIndex }
				onChange={ ( val ) => setAttributes( { zIndex: parseInt( val, 10 ) } ) }
				min={ 1 }
				max={ 20 }
				help={ __( 'An image with a greater z-index value is always in front of an element with a lower value.', 'wpv-views' ) }
			/>
		);
	}
}
