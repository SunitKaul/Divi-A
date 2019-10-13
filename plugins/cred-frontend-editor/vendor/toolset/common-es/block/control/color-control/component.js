import {
	Component,
} from '@wordpress/element';

import {
	PanelRow,
	ColorIndicator,
	ColorPalette,
} from '@wordpress/components';

import { colors } from '../../../utils';

/**
 * Combines a ColorIndicator and ColorPalette, creating a nice color control, somewhat similar to core ColorPanel,
 * but without forcing a separate panel just for this. Uses default theme color palette.
 */
export default class extends Component {
	render() {
		const {
			id,
			label,
			color,
			onChange,
			themeColors,
		} = this.props;

		const currentThemeColors = () => {
			if ( themeColors ) {
				return themeColors;
			}
			return colors();
		};

		return [
			<PanelRow key="indicator">
				<label htmlFor={ id }>{ label }</label>
				<ColorIndicator
					id={ id }
					colorValue={ color }
				/>
			</PanelRow>,
			<PanelRow key="palette">
				<ColorPalette
					colors={ currentThemeColors() }
					value={ color || {} }
					onChange={ onChange }
				/>
			</PanelRow>,
		];
	}
}
