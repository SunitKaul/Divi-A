// Internal Dependencies
import './scss/edit.scss';

/**
 * Simple Tooltip with [id] and [content].
 *
 * @since 1.1.0
 */
export class Tooltip {
	/**
	 * When the same id is used twice the first registered Tooltip will be used.
	 *
	 * @param {string} id
	 * @param {string} content
	 */
	constructor( id, content ) {
		this.id = id;
		this.content = content;

		// apply Tooltip to Dom
		this.applyToDom();

		// store dom element
		this.tooltip = document.getElementById( this.id );

		// timeout storage to make it clearable
		this.hideAfterTimeout = null;

		// store mouse position
		this.mousePosition = { x: 0, y: 0 };
		document.addEventListener( 'mousedown', ( e ) => {
			this.mousePosition = { x: e.clientX, y: e.clientY };
		} );
	}

	/**
	 * Will add a DIV with the tooltip content to the DOM.
	 * When the tooltip already exists this function does nothing.
	 *
	 */
	applyToDom() {
		if ( ! document.getElementById( this.id ) ) {
			document.body.insertAdjacentHTML(
				'beforeend',
				'<div id="' + this.id + '" class="tb-tooltip tb-tooltip-at-cursor">' +
				this.content +
				'</div>' );
		}
	}

	/**
	 * Will display the tooltip at the mouse position.
	 * Note: the mouse position is only updated on mousedown.
	 *
	 * Good Extension: Allow to pass an event and if it's set use the event mouse position.
	 *
	 * Use second parameter [hideAfter] to define the time when the Tooltip should be removed again.
	 * Set [hideAfter] to false to keep the tooltip displayed until hideAfterMs() is called manually.
	 *
	 * @param {event} event If the event is passed, it's mouse position will be used.
	 * @param {number} hideAfter
	 */
	showAtMouse( event = null, hideAfter = 2000 ) {
		const mousePosition = event ?
			{ x: event.clientX, y: event.clientY } :
			this.mousePosition;

		// show tooltip
		this.tooltip.classList.add( 'tb-tooltip-active' );
		this.tooltip.style.top = ( mousePosition.y - this.tooltip.offsetHeight - 10 ) + 'px';
		this.tooltip.style.left = ( mousePosition.x - ( this.tooltip.offsetWidth / 2 ) ) + 'px';

		// hide after (default 2 seconds)
		if ( hideAfter !== false ) {
			this.hideAfterMs( hideAfter );
		}
	}

	/**
	 * Will display the tooltip above the given node.
	 * Use second parameter [hideAfter] to define the time when the Tooltip should be removed again.
	 * Set [hideAfter] to false to keep the tooltip displayed until hideAfterMs() is called manually.
	 *
	 * @param {Node} node
	 * @param {number} hideAfter
	 */
	showAtNode( node, hideAfter = 2000 ) {
		// caret somewhere else than on the end of the shortcode
		// -> block keypress and show tooltip that typing to shortcode is not possible
		const nodeInViewport = node.getBoundingClientRect();

		// show tooltip
		this.tooltip.classList.add( 'tb-tooltip-active' );
		this.tooltip.style.top = ( parseInt( nodeInViewport.top ) - ( this.tooltip.offsetHeight + 5 ) ) + 'px';
		this.tooltip.style.left = ( parseInt( nodeInViewport.left ) +
			( parseInt( nodeInViewport.width ) / 2 ) - ( this.tooltip.offsetWidth / 2 ) ) + 'px';

		// hide after (default 2 seconds)
		if ( hideAfter !== false ) {
			this.hideAfterMs( hideAfter );
		}
	}

	/**
	 * Hide the tooltip after given [ms].
	 *
	 * @param {number} ms
	 */
	hideAfterMs( ms = 2000 ) {
		// Clear timeout to make sure the last trigger + [ms] is the display time of the tooltip.
		clearTimeout( this.hideAfterTimeout );
		this.hideAfterTimeout = setTimeout( () => {
			this.tooltip.classList.remove( 'tb-tooltip-active' );
		}, ms );
	}
}
