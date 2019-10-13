// External Dependencies
import { findIndex, debounce } from 'lodash';

// Collection of all used fonts.
var toolsetCommonEsGoogleFonts = []; // eslint-disable-line

/**
 * Debounce function to create/update <link> for loading the font.
 * If there is no change to the previous variants the function will do nothing.
 *
 */
const applyGoogleFontLinksToHead = debounce( () => {
	toolsetCommonEsGoogleFonts.forEach( ( font, index ) => {
		const linkId = `toolset-common-es-font-${ index }`;
		const href = 'https://fonts.googleapis.com/css?family=' + font.family.replace( /\s+/g, '+' ) + ':' + font.variants.join( ',' );
		const existingLink = document.getElementById( linkId );

		if ( ! existingLink ) {
			// New Font.
			const newLink = document.createElement( 'link' );
			newLink.id = linkId;
			newLink.rel = 'stylesheet';
			newLink.type = 'text/css';
			newLink.href = href;

			document.head.appendChild( newLink );
		} else if ( existingLink.href !== href ) {
			// Font already loaded but variants have changed.
			existingLink.href = href;
		}
	} );
}, 500 );

/**
 * Load Google Font
 *
 * This makes sure to only create one <link> per font, no matter how many variants of the font are in use.
 *
 * @param {string} font
 * @param {string|number} variant
 */
export function loadGoogleFont( font, variant ) {
	const fontIndex = findIndex( toolsetCommonEsGoogleFonts, { family: font } );

	if ( fontIndex >= 0 ) {
		if ( ! toolsetCommonEsGoogleFonts[ fontIndex ].variants.includes( variant ) ) {
			toolsetCommonEsGoogleFonts[ fontIndex ].variants.push( variant );
		}
	} else {
		toolsetCommonEsGoogleFonts.push( { family: font, variants: [ variant ] } );
	}

	applyGoogleFontLinksToHead();
}

