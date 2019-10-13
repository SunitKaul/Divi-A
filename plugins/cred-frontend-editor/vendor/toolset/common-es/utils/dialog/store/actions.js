/**
 * Returns an action object that, when dispatched, disables the given dialog.
 * A disabled dialog will not shown again.
 *
 * @param {string} id The dialog to dismiss.
 *
 * @return {Object} Action object.
 */
export function disableDialog( id ) {
	return {
		type: 'DISABLE_DIALOG',
		id,
	};
}
