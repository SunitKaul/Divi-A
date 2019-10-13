import { concat } from 'lodash';

export default function( attributes, extraClasses = [] ) {
	attributes = !! attributes ?
		attributes :
		{};

	const idClasses = {};

	// ID
	if ( !! attributes.id ) {
		idClasses.id = attributes.id;
	}

	// Classes
	let cssClasses = Array.isArray( extraClasses ) ?
		extraClasses :
		[];

	const attributesClasses = typeof attributes.cssClasses === 'string' ?
		attributes.cssClasses.split( ' ' ) :
		attributes.cssClasses;

	if ( Array.isArray( attributesClasses ) &&
		attributesClasses.length > 0 ) {
		cssClasses = concat( cssClasses, attributesClasses );
	}

	if ( cssClasses.length > 0 ) {
		idClasses.className = cssClasses.join( ' ' );
	}

	return idClasses;
}
