import { has } from 'lodash';
/**
 * Determines whether or not the given dialog is enabled.
 *
 * @param {Object} state Global application state.
 * @param {string} dialogId The tip to query.
 *
 * @return {boolean} Whether dialog is enabled or already disabled by the user.
 */
export function isDialogEnabled( state, dialogId ) {
	return ! has( state.preferences.disabledDialogs, [ dialogId ] );
}
