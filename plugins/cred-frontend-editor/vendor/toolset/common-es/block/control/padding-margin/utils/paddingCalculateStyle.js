export default function( style ) {
	if ( style.enabled === false ) {
		return {};
	}

	return !! style.paddingTop &&
	!! style.paddingRight &&
	!! style.paddingBottom &&
	!! style.paddingLeft ?
		{
			padding: `${ style.paddingTop } ${ style.paddingRight } ${ style.paddingBottom } ${ style.paddingLeft }`,
		} : {
			paddingTop: !! style.paddingTop ? style.paddingTop : undefined,
			paddingRight: !! style.paddingRight ? style.paddingRight : undefined,
			paddingBottom: !! style.paddingBottom ? style.paddingBottom : undefined,
			paddingLeft: !! style.paddingLeft ? style.paddingLeft : undefined,
		};
}
