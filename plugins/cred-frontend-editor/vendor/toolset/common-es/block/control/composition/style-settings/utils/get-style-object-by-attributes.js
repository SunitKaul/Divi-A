// External dependencies
import { get } from 'lodash';

// Internal dependencies
import {
	borderCalculateStyle,
	borderRadiusCalculateStyle,
	boxShadowCalculateStyle,
	marginCalculateStyle,
	paddingCalculateStyle,
	rotateCalculateStyle,
} from '../../../index';
import { loadGoogleFont, getNumberOr } from '../../../../../utils';

export default function( attributes, onlySelected = false, overwriteKeys = {} ) {
	if ( typeof attributes !== 'object' ) {
		return {};
	}

	const styleInUse = ( key ) => {
		if ( onlySelected && ! onlySelected.includes( key ) ) {
			// style not wanted
			return false;
		}

		if ( ! attributes[ key ] ) {
			// not set
			return false;
		}

		// style wanted and has a value
		return true;
	};

	const styleValue = ( key, valueCustom = false ) => {
		if ( ! styleInUse( key ) ) {
			return null;
		}

		return valueCustom ? valueCustom : attributes[ key ];
	};

	const getKey = ( defaultKey ) => {
		return overwriteKeys[ defaultKey ] ? overwriteKeys[ defaultKey ] : defaultKey;
	};

	const lineHeightUnit = attributes.lineHeightUnit || 'px';
	const letterSpacingUnit = attributes.letterSpacingUnit || 'px';

	const style = {
		display: styleValue( 'inline', 'inline-block' ),
		[ getKey( 'color' ) ]: styleValue( 'textColor' ),
		[ getKey( 'backgroundColor' ) ]: styleValue( 'backgroundColor' ),
		fontSize: styleValue( 'fontSize', attributes.fontSize + 'px' ),
		fontWeight: styleValue( 'fontWeight' ),
		textTransform: styleValue( 'textTransform' ),
		... styleInUse( 'textShadow' ) ? applyTextShadow( attributes.textShadow ) : {},
		lineHeight: styleValue( 'lineHeight', attributes.lineHeight + lineHeightUnit ),
		letterSpacing: styleValue( 'letterSpacing', attributes.letterSpacing + letterSpacingUnit ),
		... styleInUse( 'padding' ) ? paddingCalculateStyle( attributes.padding ) : {},
		... styleInUse( 'margin' ) ? marginCalculateStyle( attributes.margin ) : {},
		... styleInUse( 'border' ) ? borderCalculateStyle( attributes.border ) : {},
		... styleInUse( 'borderRadius' ) ? borderRadiusCalculateStyle( attributes.borderRadius ) : {},
		... styleInUse( 'boxShadow' ) ? boxShadowCalculateStyle( attributes.boxShadow ) : {},
		... styleInUse( 'rotate' ) ? rotateCalculateStyle( attributes.rotate ) : {},
		zIndex: styleValue( 'zIndex' ),
	};

	if ( style.enabled ) {
		// margin / padding adding this... get rid of it.
		delete ( style.enabled );
	}

	if ( styleInUse( 'fontStyle' ) && attributes.fontStyle.length > 0 ) {
		style.fontStyle = attributes.fontStyle.join( ' ' );
	}

	if ( styleInUse( 'textDecoration' ) && attributes.textDecoration.length > 0 ) {
		style.textDecoration = attributes.textDecoration.join( ' ' );
	}

	if ( styleInUse( 'font' ) ) {
		const font = attributes.font;
		const variant = styleInUse( 'fontVariant' ) ? attributes.fontVariant : 'regular';

		style.fontFamily = font;
		style.fontWeight = style.fontWeight || variant;

		loadGoogleFont( font, variant );
	}

	return { ...style, ...applyBackground( attributes ) };
}

function applyBackground( attributes ) {
	if ( ! get( attributes, 'background.type' ) ) {
		return {};
	}

	const background = attributes.background;

	switch ( background.type ) {
		case 'gradient':
			return applyBackgroundGradient( background );
		case 'image':
			return applyBackgroundImage( background );
		default:
			return applyBackgroundSolid( background );
	}
}

function applyBackgroundSolid( background ) {
	const style = {};
	const colorHex = get( background, 'solid.color.hex' );

	if ( colorHex ) {
		style.backgroundColor = colorHex;
		return style;
	}

	const r = get( background, 'solid.color.rgb.r', false );
	const g = get( background, 'solid.color.rgb.g', false );
	const b = get( background, 'solid.color.rgb.b', false );
	const a = get( background, 'solid.color.rgb.a', false );

	if ( r !== false && g !== false && b !== false && a !== false ) {
		style.backgroundColor = `rgba( ${ r }, ${ g }, ${ b }, ${ a } )`;
	}

	return style;
}

function applyBackgroundGradient( background ) {
	const style = {};
	const type = get( background, 'gradient.type' );

	if ( ! type ) {
		return style;
	}

	let styleType = type === 'linear' ?
		'linear-gradient' :
		'radial-gradient';

	const styleValues = [];

	// Attributes
	const repeating = get( background.gradient, 'repeating', false );
	const angel = get( background.gradient, 'angle', false );
	const form = get( background.gradient, 'form', 'ellipse' );

	if ( repeating ) {
		styleType = 'repeating-' + styleType;
	}

	if ( type === 'linear' && angel ) {
		styleValues.push( `${ angel }deg` );
	} else if ( type === 'radial' && form !== 'ellipse' ) {
		styleValues.push( form );
	}

	const colorsLastIndex = Object.keys( background.gradient.colors ).length - 1;
	let firstColorStop = 0;

	Object.keys( background.gradient.colors ).forEach( ( index ) => {
		let color = false;
		const intIndex = parseInt( index, 10 );

		const r = get( background.gradient.colors[ index ], 'rgb.r', false );
		const g = get( background.gradient.colors[ index ], 'rgb.g', false );
		const b = get( background.gradient.colors[ index ], 'rgb.b', false );
		const a = get( background.gradient.colors[ index ], 'rgb.a', false );
		const stop = get( background.gradient.colors[ index ], 'stop', false );

		if ( r !== false && g !== false && b !== false && a !== false ) {
			color = `rgba( ${ r }, ${ g }, ${ b }, ${ a } )`;
		}

		if ( color ) {
			// When repeating is used, it needs to be applied to the last color.
			if ( repeating && colorsLastIndex === intIndex ) {
				color += ` ${ repeating + firstColorStop }%`;
			} else if ( stop ) {
				const stopPositionWithRepeating = stopPositionRelativeToRepeatingRange( stop, repeating );

				if ( intIndex === 0 ) {
					firstColorStop = stopPositionWithRepeating;
				}
				color += ` ${ stopPositionWithRepeating }%`;
			}
			styleValues.push( color );
		}
	} );

	style.backgroundImage = `${ styleType }( ${ styleValues.join( ',' ) } )`;

	return style;
}

function applyBackgroundImage( background ) {
	const style = {};
	const url = get( background, 'image.url', '' );

	const r = get( background, 'image.color.rgb.r', false );
	const g = get( background, 'image.color.rgb.g', false );
	const b = get( background, 'image.color.rgb.b', false );
	const a = get( background, 'image.color.rgb.a', false );

	if ( r !== false && g !== false && b !== false && a !== false ) {
		style.backgroundColor = `rgba( ${ r }, ${ g }, ${ b }, ${ a } )`;
	}

	const or = get( background, 'image.overlayColor.rgb.r', false );
	const og = get( background, 'image.overlayColor.rgb.g', false );
	const ob = get( background, 'image.overlayColor.rgb.b', false );
	const oa = get( background, 'image.overlayColor.rgb.a', false );

	const backgroundImage = [];
	if ( or !== false && og !== false && ob !== false && oa !== false ) {
		backgroundImage.push( `linear-gradient(rgba( ${ or }, ${ og }, ${ ob }, ${ oa } ),rgba( ${ or }, ${ og }, ${ ob }, ${ oa } ))` );
	}

	backgroundImage.push( `url( '${ url }' )` );
	if ( backgroundImage.length > 0 ) {
		style.backgroundImage = backgroundImage.join( ',' );
	}

	const repeat = get( background, 'image.repeat', 'no-repeat' );
	let horizontal = get( background, 'image.horizontal.position', 'center' );

	style.backgroundRepeat = repeat;

	/* We use javascript for the parallax effect, otherwise background size is not useable.
	const attachment = get( background, 'image.attachment', false );

	if ( attachment ) {
		style.backgroundAttachment = attachment;
	}
	 */

	if ( horizontal === 'custom' ) {
		const horizontalValue = get( background, 'image.horizontal.value', 'left' );
		const horizontalUnit = get( background, 'image.horizontal.unit', 'px' );

		horizontal = horizontalValue !== 'left' ?
			horizontalValue + horizontalUnit :
			'left';
	}

	style.backgroundPositionX = horizontal;

	// Only apply vertical position if fixed position is not used.
	if ( get( background, 'image.attachment' ) !== 'fixed' ) {
		let vertical = get( background, 'image.vertical.position', 'center' );

		if ( vertical === 'custom' ) {
			const verticalValue = get( background, 'image.vertical.value', 'top' );
			const verticalUnit = get( background, 'image.vertical.unit', 'px' );

			vertical = verticalValue !== 'top' ?
				verticalValue + verticalUnit :
				'top';
		}

		style.backgroundPositionY = vertical;
	}

	const size = get( background, 'image.size', 'cover' );

	if ( size !== 'auto' && size !== 'custom' ) {
		style.backgroundSize = size;
	} else if ( size === 'custom' ) {
		const width = get( background, 'image.width', 'auto' );
		const widthUnit = get( background, 'image.widthUnit', 'px' );
		const height = get( background, 'image.height', 'auto' );
		const heightUnit = get( background, 'image.heightUnit', 'px' );

		const styleWidth = width !== 'auto' ?
			width + widthUnit :
			'auto';

		const styleHeight = height !== 'auto' ?
			height + heightUnit :
			'auto';

		style.backgroundSize = `${ styleWidth } ${ styleHeight }`;
	}

	return style;
}

function stopPositionRelativeToRepeatingRange( stop, repeating ) {
	if ( ! repeating ) {
		return stop;
	}

	const intStop = parseInt( stop, 10 );
	const intRepeating = parseInt( repeating, 10 );

	const stopRelativeToRepeating = parseInt( intRepeating / 100 * intStop, 10 );

	if ( stopRelativeToRepeating > repeating ) {
		return repeating;
	}

	return stopRelativeToRepeating;
}

function applyTextShadow( textShadow ) {
	const { enabled, color, horizontal, vertical, blur } = textShadow;

	if ( ! enabled ||
		(
			getNumberOr( horizontal ) === '' &&
			getNumberOr( vertical ) === '' &&
			getNumberOr( blur ) === ''
		)
	) {
		return {};
	}
	const { r, g, b, a } = color.rgb;

	return { textShadow: `${ horizontal }px ${ vertical }px ${ blur }px rgba( ${ r }, ${ g }, ${ b }, ${ a } )` };
}
