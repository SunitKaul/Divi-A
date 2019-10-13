/**
 * Limits the amount a function is invoked
 *
 * @param {function} func Function
 * @param {integer} limit Waiting time
 * @return {function}
 * @link https://codeburst.io/throttling-and-debouncing-in-javascript-b01cad5c8edf
 */
export function throttle( func, limit = 500 ) {
	let lastFunc;
	let lastRan;
	return function() {
		const context = this;
		const args = arguments;
		if ( ! lastRan ) {
			func.apply( context, args );
			lastRan = Date.now();
		} else {
			clearTimeout( lastFunc );
			lastFunc = setTimeout( function() {
				if ( ( Date.now() - lastRan ) >= limit ) {
					func.apply( context, args );
					lastRan = Date.now();
				}
			}, limit - ( Date.now() - lastRan ) );
		}
	};
}
