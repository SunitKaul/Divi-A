// WordPress Dependencies
import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

// Internal Dependencies
import { ColorControl } from '../../../../../index';

export class Solid extends Component {
	render() {
		const { background, setBackground } = this.props;

		const color = background.solid.color.hex || null;

		return (
			<ColorControl
				label={ __( 'Background Color', 'wpv-views' ) }
				color={ color }
				onChange={ hex => setBackground( { solid: { color: { hex } } } ) }
			/>
		);
	}
}
