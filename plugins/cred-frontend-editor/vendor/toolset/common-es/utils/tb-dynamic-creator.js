export function tbDynamicCreator( isDynamic, source, field, provider, noDynamicReturn = '', post = 'current', forceString = false, extraAttributes = {} ) {
	if ( isDynamic && source ) {
		const attributes = { provider, post, source, ...extraAttributes };
		let shortcode = '[tb-dynamic';

		Object.keys( attributes ).forEach( ( name ) => {
			shortcode += ` ${ name }='${ attributes[ name ] }'`;
		} );

		if ( !! field ) {
			shortcode += ` field='${ field }'`;
		}

		if ( forceString ) {
			shortcode += ` force-string='${ forceString }' `;
		}

		shortcode += ']';
		return shortcode;
	}

	return noDynamicReturn;
}
