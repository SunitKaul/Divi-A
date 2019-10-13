/**
 * WordPress dependencies
 */
import { registerStore } from '@wordpress/data';

/**
 * Internal dependencies
 */
import reducer from './reducer';
import * as actions from './actions';
import * as selectors from './selectors';

const store = registerStore( 'toolset/dialogs', {
	reducer,
	actions,
	selectors,
	persist: [ 'preferences' ],
} );

export default store;
