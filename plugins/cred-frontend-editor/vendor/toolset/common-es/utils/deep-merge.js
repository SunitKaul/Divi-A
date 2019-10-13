import merge from 'deepmerge';

// Just an alias of deepmerge (so it only needs to be bundled once in common es).
export function deepMerge( target, source, options = {} ) {
	return merge( target, source, options );
}
