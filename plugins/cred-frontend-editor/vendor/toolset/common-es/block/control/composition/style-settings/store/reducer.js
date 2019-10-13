import { uniq } from 'lodash';
import { deepMerge, stringToCssClass, Settings } from '../../../../../utils';

/**
 * Reducer for settings
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
function settings( state = {}, action ) {
	switch ( action.type ) {
		case 'ADD_CSS_CLASS':

			if ( ! Array.isArray( action.payload ) ) {
				return state;
			}

			const newClasses = action.payload.map( cssClass => stringToCssClass( cssClass ) );
			let mergedWithStored = deepMerge( state.classes, newClasses );
			mergedWithStored = uniq( mergedWithStored ).sort();

			if ( mergedWithStored === state.classes ) {
				// no changes
				return state;
			}

			Settings.persist( 'classes', mergedWithStored );

			return {
				...state,
				classes: mergedWithStored,
			};
		default:
			return state;
	}
}

export default settings;
