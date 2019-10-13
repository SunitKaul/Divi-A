export default function( style ) {
	if ( style.enabled === false ) {
		return {};
	}

	return !! style.marginTop &&
	!! style.marginRight &&
	!! style.marginBottom &&
	!! style.marginLeft ?
		{
			margin: `${ style.marginTop } ${ style.marginRight } ${ style.marginBottom } ${ style.marginLeft }`,
		} : {
			marginTop: !! style.marginTop ? style.marginTop : undefined,
			marginRight: !! style.marginRight ? style.marginRight : undefined,
			marginBottom: !! style.marginBottom ? style.marginBottom : undefined,
			marginLeft: !! style.marginLeft ? style.marginLeft : undefined,
		};
}
