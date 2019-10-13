const { Toolset } = window;

/**
 * Adjust the composed shortcode for field types that can produce extra shortcodes per option.
 *
 * @param {string} craftedShortcode Previous generated shortcode
 * @param {object} shortcodeData    Shortcode attributes object
 *     shortcode     string The shortcode handle
 *     attributes    object Pairs of attributes key and value, after processing
 *     rawAttributes object Pairs of attributes key and value, without processing
 * @param {object} fieldOptions List of field options (radio, checkboxes, select)
 *
 * @return {string}
 * @link https://git.onthegosystems.com/toolset/types/blob/develop/public/js/types_shortcode.js#L1761
 */
const adjustComposedShortcodes = ( craftedShortcode, shortcodeData, fieldOptions = {} ) => {
	const rawAttributes = shortcodeData.rawAttributes;
	const shortcodeAttributeValues = shortcodeData.attributes;
	let composedShortcode = craftedShortcode;
	let composedAttributeString = '';

	const pickNonSelectedUnselectedValues = object => {
		return Object.keys( object )
			.filter( key => ( ! /selectedValue/.test( key ) ) )
			.reduce( ( obj, key ) => {
				return {
					...obj,
					[ key ]: object[ key ],
				};
			}, {} );
	};

	switch ( rawAttributes.metaType ) {
		case 'checkbox':
			composedShortcode = '';
			if ( !! shortcodeAttributeValues.output && 'custom' === shortcodeAttributeValues.output ) {
				shortcodeAttributeValues.output = false;

				if ( ! shortcodeAttributeValues.selectedValue ) {
					shortcodeAttributeValues.selectedValue = '';
				}
				if ( ! shortcodeAttributeValues.unselectedValue ) {
					shortcodeAttributeValues.unselectedValue = '';
				}

				Object.keys( shortcodeAttributeValues ).forEach( key => {
					const value = shortcodeAttributeValues[ key ];
					if ( value && ! [ 'selectedValue', 'unselectedValue' ].includes( key ) ) {
						composedAttributeString += ` ${ key }='${ value }'`;
					}
				} );

				composedShortcode = '[' + shortcodeData.shortcode +
					composedAttributeString + ' state="checked"]' +
					shortcodeAttributeValues.selectedValue +
					'[/' + shortcodeData.shortcode + ']' +
					'[' + shortcodeData.shortcode +
					composedAttributeString +
					' state="unchecked"]' +
					shortcodeAttributeValues.unselectedValue +
					'[/' + shortcodeData.shortcode + ']';

				craftedShortcode = composedShortcode;
			}
			break;

		case 'checkboxes':
			composedShortcode = '';
			if ( !! shortcodeAttributeValues.output && 'custom' === shortcodeAttributeValues.output ) {
				shortcodeAttributeValues.output = false;
				shortcodeAttributeValues.separator = false;

				const shortcodeAttributeValuesClone = JSON.parse( JSON.stringify( shortcodeAttributeValues ) );
				let loopIndex = 0;

				const selectedValues = pickNonSelectedUnselectedValues( shortcodeAttributeValuesClone );

				Object.keys( fieldOptions ).forEach( () => {
					if ( !! shortcodeAttributeValues[ 'selectedValue_' + loopIndex ] ) {
						composedAttributeString = '';
						Object.keys( selectedValues ).forEach( key => {
							const value = selectedValues[ key ];
							if ( value ) {
								composedAttributeString += ` ${ key }='${ value }'`;
							}
						} );
						composedShortcode += `[${ shortcodeData.shortcode }` +
							composedAttributeString +
							` state="checked" option="${ loopIndex }"]` +
							shortcodeAttributeValues[ 'selectedValue_' + loopIndex ] +
							`[/${ shortcodeData.shortcode }]`;
					}

					if ( !! shortcodeAttributeValues[ 'unselectedValue_' + loopIndex ] ) {
						composedAttributeString = '';
						Object.keys( selectedValues ).forEach( key => {
							const value = selectedValues[ key ];
							if ( value ) {
								composedAttributeString += ` ${ key }='${ value }'`;
							}
						} );
						composedShortcode += `[${ shortcodeData.shortcode }` +
							composedAttributeString +
							` state="unchecked" option="${ loopIndex }"]` +
							shortcodeAttributeValues[ 'unselectedValue_' + loopIndex ] +
							`[/${ shortcodeData.shortcode }]`;
					}
					loopIndex++;
				} );
				craftedShortcode = composedShortcode;
			}
			break;

		case 'radio':
			composedShortcode = '';
			if ( !! shortcodeAttributeValues.output && 'custom' === shortcodeAttributeValues.output ) {
				shortcodeAttributeValues.output = false;

				const shortcodeAttributeValuesClone = JSON.parse( JSON.stringify( shortcodeAttributeValues ) );

				const selectedValues = pickNonSelectedUnselectedValues( shortcodeAttributeValuesClone );

				Object.keys( fieldOptions ).forEach( ( metaKey, index ) => {
					if ( !! shortcodeAttributeValues[ 'selectedValue_' + index ] ) {
						composedAttributeString = '';
						Object.keys( selectedValues ).forEach( key => {
							const value = selectedValues[ key ];
							if ( value ) {
								composedAttributeString += ` ${ key }='${ value }'`;
							}
						} );
						composedShortcode += `[${ shortcodeData.shortcode }` +
							composedAttributeString +
							` option="${ metaKey }"]` +
							shortcodeAttributeValues[ 'selectedValue_' + index ] +
							`[/${ shortcodeData.shortcode }]`;
					}
				} );
				craftedShortcode = composedShortcode;
			}
			break;
	}
	return craftedShortcode;
};

/**
 * Generates a shortcode
 *
 * @param {string} fieldSlug Field slug
 * @param {string} fieldType Field type
 * @param {object} attributeList List of attributes
 * @param {object} fieldOptions List of field options (radio, checkboxes, select)
 * @return {string}
 */
export default function( fieldSlug, fieldType, attributeList, fieldOptions ) {
	const attributes = Object.assign( { field: fieldSlug }, attributeList );
	const rawAttributes = Object.assign( {}, attributes, { metaType: fieldType } );
	Object.assign( attributes, Toolset.hooks.applyFilters( 'toolset-filter-shortcode-gui-computed-attribute-values', attributes, { shortcode: 'types', rawAttributes } ) );
	const shortcodeAttributeString = Object.keys( attributes ).map( attr => {
		if ( ! attributes[ attr ] || ( fieldType === 'video' && attributes[ attr ] === 'off' ) ) {
			return '';
		}
		return `${ attr }='${ attributes[ attr ] }'`;
	} ).join( ' ' );
	let shortcode = `[types ${ shortcodeAttributeString }]`;
	shortcode += '[/types]';
	shortcode = Toolset.hooks.applyFilters( 'toolset-filter-shortcode-gui-crafted-shortcode', shortcode, { shortcode: 'types', attributes: attributes, rawAttributes: attributes } );
	shortcode = adjustComposedShortcodes( shortcode, { shortcode: 'types', attributes, rawAttributes, container: null }, fieldOptions );

	return shortcode;
}
