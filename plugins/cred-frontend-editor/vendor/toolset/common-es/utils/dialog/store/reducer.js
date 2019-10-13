// WordPress dependencies
import { combineReducers } from '@wordpress/data';

/**
 * Reducer that tracks which dialogs have been disabled by the user.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
function disabledDialogs( state = {}, action ) {
	switch ( action.type ) {
		case 'DISABLE_DIALOG':
			return {
				...state,
				[ action.id ]: true,
			};
	}

	return state;
}

const preferences = combineReducers( { disabledDialogs } );

export default combineReducers( { preferences } );
