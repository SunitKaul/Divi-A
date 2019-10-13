// External Dependencies
import PropTypes from 'prop-types';

// WordPress Dependencies
import { Component, Fragment } from '@wordpress/element';
import { ColorPicker as WPColorPicker, Dropdown, Tooltip } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

// Internal Dependencies
import './scss/edit.scss';

/**
 * Control "Color Picker"
 * currently it only supports one format: Circle of the selected color which offers settings in a dropdown (onclick).
 *
 * @since 1.0.0
 */
class ColorPicker extends Component {
	render() {
		const colorPicker = `rgba( ${ this.props.color.rgb.r }, ${ this.props.color.rgb.g }, ${ this.props.color.rgb.b }, ${ this.props.color.rgb.a } )`;
		const label = this.props.label || null;
		return (
			<Fragment>
				{ label &&
				<span className="tb-control-color-picker-label">{ label }</span>
				}
				<div className="tb-control-color-picker">
					<Dropdown
						className="components-color-palette__item-wrapper components-color-palette__custom-color"
						contentClassName="components-color-palette__picker"
						renderToggle={ ( { isOpen, onToggle } ) => (
							<Tooltip text={ __( 'Click to choose a color', 'wpv-views' ) }>
								<div className="components-color-picker__swatch">
									<button
										type="button"
										aria-expanded={ isOpen }
										className="components-color-palette__item"
										onClick={ onToggle }
										style={ { backgroundColor: colorPicker, color: colorPicker } }
									>
									</button>
								</div>
							</Tooltip>
						) }
						renderContent={ () => (
							<WPColorPicker
								color={ this.props.color.rgb }
								onChangeComplete={ ( color ) => this.props.onChange( color ) }
							/>
						) }
					/>
				</div>
			</Fragment>
		);
	}
}

ColorPicker.defaultProps = {
	color: { hex: '#000000', rgb: { r: 0, g: 0, b: 0, a: 1 } },
};

ColorPicker.propTypes = {
	color: PropTypes.object,
	onChange: PropTypes.func.isRequired,
};

export default ColorPicker;
