/**
 * Gets an ID based on a library
 *
 * @param {string} url URL
 * @since 1.0.0
 * @return {string}
 */
export const getIdFromUrl = url => {
	return url.replace( /.*\/([^\/]+)$/, '$1' );
};
