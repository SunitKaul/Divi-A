/**
 * Settings are spreading across nested objects, this method gets all of them.
 *
 * @param {object} fields Fields object
 * @param {object} options Result object
 * @return {object}
 */
const getInitialOptions = ( fields, options ) => {
	if ( fields.constructor !== Object ) {
		return result;
	}
	const result = Object.assign( {}, options );
	Object.keys( fields ).forEach( key => {
		if ( key === 'fields' ) {
			const newOptions = {};
			Object.keys( fields[ key ] ).forEach( optionKey => {
				newOptions[ optionKey ] = !! fields[ key ][ optionKey ].defaultValue ? fields[ key ][ optionKey ].defaultValue : '';
				if ( !! fields[ key ][ optionKey ].defaultForceValue && ! newOptions[ optionKey ] ) {
					newOptions[ optionKey ] = fields[ key ][ optionKey ].defaultForceValue;
				}
			} );
			Object.assign( result, newOptions );
		}
		if ( fields[ key ].constructor === Object ) {
			Object.assign( result, getInitialOptions( fields[ key ], result ) );
		}
	} );
	return result;
};

export default getInitialOptions;
