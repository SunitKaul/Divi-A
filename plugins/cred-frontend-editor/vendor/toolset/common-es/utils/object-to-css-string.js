import { kebabCase } from 'lodash';

export function objectToCssString( styleObject ) {
	const styleArray = Object.keys( styleObject ).map( key => {
		if ( !! styleObject[ key ] || styleObject[ key ] === 0 || styleObject[ key ] === '0' ) {
			return kebabCase( key ) + `: ${ styleObject[ key ] };`;
		}
	} );

	return styleArray.length > 0 ? styleArray.join( ' ' ) : undefined;
}
