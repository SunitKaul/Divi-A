/**
 * Get field type's fields from `types_shortcode_i18n`
 *
 * @param {object} fieldType Field type object get from Dynamic sources
 * @return {array}
 */
export default function( fieldType ) {
	const { types_shortcode_i18n: typesShortcode } = window;

	if ( ! typesShortcode.attributes ||
		! typesShortcode.attributes[ fieldType.type ] ||
		! typesShortcode.attributes[ fieldType.type ].displayOptions ||
		! typesShortcode.attributes[ fieldType.type ].displayOptions.fields ) {
		return [];
	}

	return JSON.parse( JSON.stringify( typesShortcode.attributes[ fieldType.type ] ) );
}
