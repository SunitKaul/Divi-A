import { getIdFromUrl } from './get-id-from-url';

/**
 * Gets css rules form a URL.
 *
 * External domain CSS can be reached by `document.styleSheets` due to security reasons
 * Updates control state
 *
 * @param {string} url CSS url
 * @param {function} callback Function executed after Promise resolve
 * @link https://stackoverflow.com/a/14865690/2103269
 */
export default function( url, callback = null ) {
	const id = getIdFromUrl( url );
	window.fetch( url )
		.then( response => response.text() )
		.then( content => {
			// Fakes a document element so css are not loaded locally and mess with the external resource
			const doc = document.implementation.createHTMLDocument( '' ),
				styleElement = document.createElement( 'style' );

			// Escaping is needed because when creating the style element,
			// CSSStyle rule translates unicode code points to its unicode char: "\u2606" -> ☆
			styleElement.textContent = content.replace( /"\\/g, '"\\\\' );
			// the style will only be parsed once it is added to a document
			doc.body.appendChild( styleElement );
			const cssList = {};
			cssList[ id ] = [ ... styleElement.sheet.cssRules ];
			if ( !! callback && callback.constructor === Function ) {
				callback( id, cssList );
			}
		} );
}
