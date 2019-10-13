/**
 * Clones an object deeply
 *
 * @param {object} object
 * @return {object}
 */
export function deepCloneObject( object ) {
	if ( ! object || object.constructor !== Object ) {
		return object;
	}
	return JSON.parse( JSON.stringify( object ) );
}
