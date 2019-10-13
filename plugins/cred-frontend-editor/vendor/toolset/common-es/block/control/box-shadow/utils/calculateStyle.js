import { getNumberOr } from '../../../../utils';

export default function( ...boxShadows ) {
	const style = [];

	Object.keys( boxShadows ).forEach( ( key ) => {
		const { enabled, color, horizontal, vertical, blur, spread } = boxShadows[ key ];

		if ( ! enabled ||
			(
				getNumberOr( horizontal ) === '' &&
				getNumberOr( vertical ) === '' &&
				getNumberOr( blur ) === '' &&
				getNumberOr( spread ) === ''
			)
		) {
			return;
		}
		const { r, g, b, a } = color.rgb;
		style.push( `${ horizontal }px ${ vertical }px ${ blur }px ${ spread }px rgba( ${ r }, ${ g }, ${ b }, ${ a } )` );
	} );

	if ( style.length === 0 ) {
		// no box shadow to apply
		return {};
	}

	return { boxShadow: style.join( ', ' ) };
}

/*
export default function( { enabled, color, horizontal, vertical, blur, spread }, onlyValue = false ) {
	if ( ! enabled || ( horizontal === 0 && vertical === 0 && blur === 0 && spread === 0 ) ) {
		// box shadow to apply
		return {};
	}

	const { r, g, b, a } = color.rgb;
	const value = `${ horizontal }px ${ vertical }px ${ blur }px ${ spread }px rgba( ${ r }, ${ g }, ${ b }, ${ a } )`;

	return onlyValue ? value : { boxShadow: value };
}
 */
