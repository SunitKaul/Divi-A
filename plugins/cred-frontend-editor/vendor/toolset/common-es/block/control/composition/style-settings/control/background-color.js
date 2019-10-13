import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { ColorControl } from '../../../index';
import { getKeyOrDefault } from '../../../../../utils';

export default class extends Component {
	render() {
		const { data, setAttributes, labels } = this.props;

		return (
			<ColorControl
				label={ getKeyOrDefault( labels, 'backgroundColor', __( 'Background Color', 'wpv-views' ) ) }
				color={ data.backgroundColor }
				onChange={ backgroundColor => setAttributes( { backgroundColor } ) }
			/>
		);
	}
}
