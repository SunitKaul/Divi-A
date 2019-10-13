/**
 * Taking a html string as input and offers some methods to analyse the DOM of the input.
 *
 * @param {string} string
 *
 * @since 1.0.0
 */
export default class {
	constructor( string ) {
		// eslint-disable-next-line
		this.dom = new DOMParser().parseFromString( string, 'text/html' );
	}

	hasForm() {
		return this.dom.getElementsByTagName( 'FORM' ).length > 0;
	}

	firstChildDisplayValue() {
		const firstChild = this.dom.body.firstChild;

		if ( ! firstChild || ! firstChild.tagName ) {
			return false;
		}

		let display;

		if ( !! firstChild.style.display ) {
			display = firstChild.style.display;
		} else {
			// check for aligncenter image, which has block style by class
			if ( firstChild.tagName === 'IMG' && firstChild.classList.contains( 'aligncenter' ) ) {
				return 'block';
			}
			const firstChildContainer = document.createElement( 'div' );
			firstChildContainer.style.display = 'hidden';
			firstChildContainer.appendChild( firstChild );
			document.body.appendChild( firstChildContainer );
			display = window.getComputedStyle( firstChild ).display;
			document.body.removeChild( firstChildContainer );
		}
		return display;
	}
}
