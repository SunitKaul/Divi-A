// WordPress Dependencies
import { registerStore } from '@wordpress/data';

export const name = 'toolset/styles';

// Internal Dependencies
import reducer from './reducer';
import * as actions from './actions';
import * as selectors from './selectors';
import { Settings } from '../../../../../utils';

const storedClasses = Settings.get( 'classes' );

const store = registerStore( name, {
	reducer,
	actions,
	selectors,
	initialState: {
		classes: storedClasses !== null ? storedClasses : [],
	},
} );

export default store;
