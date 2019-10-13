/**
 * Group of utilities for Dynamic sources
 */

/**
 * Custom Post providers includes the post ID, this function returns it.
 *
 * @param {string} provider
 * @returns {number|null}
 */
export function getIdFromCustomPostProvider( provider ) {
	if ( provider.match( /^custom_post_type\|[^\|]+\|\d+$/ ) ) {
		const [ , , postId ] = provider.split( '|' );
		return postId;
	}
	return null;
}

