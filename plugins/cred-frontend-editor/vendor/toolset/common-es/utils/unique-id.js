var toolsetBlocksUniqueId = []; // eslint-disable-line

/**
 * Returns a unique id. Scope is current window.
 * A "wanted_id" can be passed, which will be returned if it wasn't used before.
 * This is important for block validation, because blocks need to keep their id once saved.
 *
 * The initial reason for this function was caused by duplicated ids when using
 * "Duplicate Block" which ends in linked hover effects with the parent.
 *
 * @param {string|number} wantedId
 * @returns {string|number}
 */
export function getUniqueId( wantedId = 1 ) {
	if ( !! wantedId && ! toolsetBlocksUniqueId.includes( wantedId ) ) {
		// the wanted id is not used yet, store and return
		toolsetBlocksUniqueId.push( wantedId );

		return wantedId;
	}

	// find next unused id
	let i = 1;
	while ( toolsetBlocksUniqueId.includes( i ) ) {
		i++;
	}

	// store and return unique id
	toolsetBlocksUniqueId.push( i );
	return i;
}

