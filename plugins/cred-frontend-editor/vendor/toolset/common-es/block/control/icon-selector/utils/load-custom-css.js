import { getIdFromUrl } from './get-id-from-url';
import rulesFromCssText from './rules-from-css-text';

/**
 * Given an url it loads the style and CSS ruls
 *
 * @param {string} url CSS url
 * @return {string}
 */
export default function( url ) {
	const id = getIdFromUrl( url );
	if ( !! document.getElementById( `toolset-css-${ id }` ) ) {
		return;
	}
	const linkElement = document.createElement( 'link' );
	linkElement.setAttribute( 'id', `toolset-css-${ id }` );
	linkElement.setAttribute( 'rel', 'stylesheet' );
	linkElement.setAttribute( 'type', 'text/css' );
	linkElement.setAttribute( 'href', url );
	document.getElementsByTagName( 'head' )[ 0 ].appendChild( linkElement );
	rulesFromCssText( url );
	return url;
}
