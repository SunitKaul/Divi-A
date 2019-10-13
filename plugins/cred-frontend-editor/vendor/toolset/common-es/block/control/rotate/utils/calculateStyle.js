import { getNumberOr } from '../../../../utils';

export default function( value ) {
	const normalisedValue = getNumberOr( value );
	if ( normalisedValue === '' ) {
		return {};
	}
	return {
		transform: `rotate(${ value }deg)`,
	};
}
