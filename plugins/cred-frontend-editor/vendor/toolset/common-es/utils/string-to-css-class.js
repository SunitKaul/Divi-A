export default function( string ) {
	return encodeURIComponent( string.toLowerCase() ).replace( /%[0-9A-F]{2}/gi, '' );
}
