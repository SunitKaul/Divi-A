/* eslint-disable */
export function decodeBase64( input ) {
	let output = '',
		chr1, chr2,
		chr3 = '',
		enc1, enc2, enc3,
		enc4 = '',
		i = 0;

	const keyStr = 'ABCDEFGHIJKLMNOP' +
            'QRSTUVWXYZabcdef' +
            'ghijklmnopqrstuv' +
            'wxyz0123456789+/' +
            '=';

	// remove all characters that are not A-Z, a-z, 0-9, +, /, or =
	const base64test = /[^A-Za-z0-9\+\/\=]/g;
	if ( base64test.exec( input ) ) {
		console.log( 'There were invalid base64 characters in the input text.\n' +
            'Valid base64 characters are A-Z, a-z, 0-9, \'+\', \'/\',and \'=\'\n' +
            'Expect errors in decoding.' );
	}
	input = input.replace( /[^A-Za-z0-9\+\/\=]/g, '' );

	do {
		enc1 = keyStr.indexOf( input.charAt( i++ ) );
		enc2 = keyStr.indexOf( input.charAt( i++ ) );
		enc3 = keyStr.indexOf( input.charAt( i++ ) );
		enc4 = keyStr.indexOf( input.charAt( i++ ) );

		chr1 = ( enc1 << 2 ) | ( enc2 >> 4 );
		chr2 = ( ( enc2 & 15 ) << 4 ) | ( enc3 >> 2 );
		chr3 = ( ( enc3 & 3 ) << 6 ) | enc4;

		output = output + String.fromCharCode( chr1 );

		if ( enc3 != 64 ) {
			output = output + String.fromCharCode( chr2 );
		}
		if ( enc4 != 64 ) {
			output = output + String.fromCharCode( chr3 );
		}

		chr1 = chr2 = chr3 = '';
		enc1 = enc2 = enc3 = enc4 = '';
	} while ( i < input.length );

	return decodeUtf8( output );
}

export function decodeUtf8( utftext ) {
	let string = '';
	let i = 0,
	 c = 0,
	 c1 = 0,
	 c2 = 0;

	while ( i < utftext.length ) {
		c = utftext.charCodeAt( i );

		if ( c < 128 ) {
			string += String.fromCharCode( c );
			i++;
		} else if ( ( c > 191 ) && ( c < 224 ) ) {
			c2 = utftext.charCodeAt( i + 1 );
			string += String.fromCharCode( ( ( c & 31 ) << 6 ) | ( c2 & 63 ) );
			i += 2;
		} else {
			c2 = utftext.charCodeAt( i + 1 );
			c3 = utftext.charCodeAt( i + 2 );
			string += String.fromCharCode( ( ( c & 15 ) << 12 ) | ( ( c2 & 63 ) << 6 ) | ( c3 & 63 ) );
			i += 3;
		}
	}

	return string;
}
