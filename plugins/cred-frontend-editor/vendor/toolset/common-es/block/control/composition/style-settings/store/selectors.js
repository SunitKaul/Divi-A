import { get } from 'lodash';

/**
 * Returns already used classes.
 *
 * @param {Object} state Global application state.
 *
 * @return {boolean} Default: false
 */
export function getClasses( state ) {
	return get( state, 'classes', [] );
}
