import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { ToggleControl } from '@wordpress/components';

export default class extends Component {
	render() {
		const { data, setAttributes } = this.props;

		return (
			<ToggleControl
				label={ __( 'Width related to content.', 'wpv-views' ) }
				checked={ data.inline }
				onChange={ inline => {
					inline = inline === false ? null : inline;
					setAttributes( { inline } );
				} }
			/>
		);
	}
}
