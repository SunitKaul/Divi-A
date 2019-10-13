export function getNumberOr( input, returnIfNoNumber = '' ) {
	const val = parseInt( input );

	return Number.isNaN( val ) ? returnIfNoNumber : val;
}
