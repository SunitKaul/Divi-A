// WordPress dependencies
import { Component, Fragment } from '@wordpress/element';

// Internal dependencies
import {
	ControlBackgroundColor,
	ControlBorder,
	ControlBorderRadius,
	ControlBoxShadow,
	ControlFontSize,
	ControlLineHeight,
	ControlLetterSpacing,
	ControlMarginPadding,
	ControlTextColor,
	ControlRotate,
	ControlZIndex,
	ControlIdCssClasses,
	ControlBackground,
	ControlFontFamily,
	ControlFontIconToolbar,
	ControlTextTransform,
	ControlTextShadow,
} from '../control';

export default class extends Component {
	render() {
		const { controls, data, labels, setAttributes, passThrough, controlsMapping } = this.props;

		return (
			<Fragment>
				{ controls.includes( 'idClasses' ) &&
				<ControlIdCssClasses
					setAttributes={ setAttributes }
					data={ data }
				/>
				}

				{ controls.includes( 'fontFamily' ) &&
				<ControlFontFamily
					setAttributes={ setAttributes }
					data={ data }
				/>
				}

				{ controls.includes( 'fontSize' ) &&
				<ControlFontSize
					setAttributes={ setAttributes }
					data={ data }
				/>
				}

				{ controls.includes( 'lineHeight' ) &&
				<ControlLineHeight
					setAttributes={ setAttributes }
					data={ data }
				/>
				}

				{ controls.includes( 'letterSpacing' ) &&
				<ControlLetterSpacing
					setAttributes={ setAttributes }
					data={ data }
				/>
				}

				{ controls.includes( 'fontIconToolbar' ) &&
				<ControlFontIconToolbar
					setAttributes={ setAttributes }
					data={ data }
				/>
				}

				{ controls.includes( 'textTransform' ) &&
				<ControlTextTransform
					setAttributes={ setAttributes }
					data={ data }
				/>
				}

				{ controls.includes( 'textColor' ) &&
				<ControlTextColor
					setAttributes={ setAttributes }
					data={ data }
					labels={ labels }
					controlsMapping={ controlsMapping }
				/>
				}

				{ controls.includes( 'textShadow' ) &&
				<ControlTextShadow
					setAttributes={ setAttributes }
					data={ data }
				/>
				}

				{ controls.includes( 'background' ) &&
				<ControlBackground
					setAttributes={ setAttributes }
					data={ data }
					labels={ labels }
					passThrough={ passThrough }
				/>
				}

				{ controls.includes( 'backgroundColor' ) &&
				<ControlBackgroundColor
					setAttributes={ setAttributes }
					data={ data }
					labels={ labels }
				/>
				}

				{ controls.includes( 'margin' ) &&
				<ControlMarginPadding
					setAttributes={ setAttributes }
					data={ data }
				/>
				}

				{ controls.includes( 'border' ) &&
				<ControlBorder
					setAttributes={ setAttributes }
					data={ data }
				/>
				}

				{ controls.includes( 'borderRadius' ) &&
				<ControlBorderRadius
					setAttributes={ setAttributes }
					data={ data }
					disabled={ passThrough.borderRadius && passThrough.borderRadius.disabled ? passThrough.borderRadius.disabled : null }
				/>
				}

				{ controls.includes( 'rotate' ) &&
				<ControlRotate
					setAttributes={ setAttributes }
					data={ data }
				/>
				}

				{ controls.includes( 'boxShadow' ) &&
				<ControlBoxShadow
					setAttributes={ setAttributes }
					data={ data }
				/>
				}

				{ controls.includes( 'zIndex' ) &&
				<ControlZIndex
					setAttributes={ setAttributes }
					data={ data }
				/>
				}
			</Fragment>
		);
	}
}
