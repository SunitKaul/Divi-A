import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { ColorControl } from '../../../../index';
import { getKeyOrDefault } from '../../../../../../utils';

export default class extends Component {
	render() {
		const { data, setAttributes, labels, controlsMapping } = this.props;

		const attributeKey = controlsMapping.textColor ? controlsMapping.textColor : 'textColor';

		return (
			<ColorControl
				label={ getKeyOrDefault( labels, 'textColor', __( 'Text Color', 'wpv-views' ) ) }
				color={ data[ attributeKey ] }
				onChange={ textColor => setAttributes( { [ attributeKey ]: textColor } ) }
			/>
		);
	}
}
