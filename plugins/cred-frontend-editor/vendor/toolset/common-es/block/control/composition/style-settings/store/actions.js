/**
 * Action to set the maximum width.
 *
 * @param {string} cssClass
 * @return {{payload: int, type: string}}
 */
export function addCssClass( cssClass ) {
	return {
		type: 'ADD_CSS_CLASS',
		payload: cssClass,
	};
}
