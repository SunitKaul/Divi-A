/**
 * Utility class for getting computed styles from an object
 *
 * @link https://medium.com/@captaindaylight/get-a-subset-of-an-object-9896148b9c72
 */
export default class ComputedStyle {
	/**
	 * Constructor
	 *
	 * @param {DOMElement} object HTML object
	 */
	constructor( object ) {
		this.object = object;
		this.computedStyles = window.getComputedStyle( object );
	}

	pxToEm( value, parentValue ) {
		return parseFloat( ( parseFloat( value ) / parseFloat( parentValue ) ).toFixed( 2 ) ) + 'em'; // First parseFloat changes 0.00 -> 0 / 1.50 -> 1.5
	}

	changeObjectUnitsToEm( values ) {
		Object.keys( values ).forEach( key => {
			values[ key ] = this.pxToEm( values[ key ], this.computedStyles.fontSize );
		} );
	}
	/**
	 * Returns border radius object
	 *
	 * @return {object}
	 */
	getBorderRadius() {
		return ( ( { borderTopLeftRadius, borderTopRightRadius, borderBottomLeftRadius, borderBottomRightRadius } ) => ( { borderTopLeftRadius, borderTopRightRadius, borderBottomLeftRadius, borderBottomRightRadius } ) )( this.computedStyles );
	}

	/**
	 * Returns margin object
	 *
	 * @param {boolean} toEm Converts to em
	 * @return {object}
	 */
	getMargin( toEm = false ) {
		const values = ( ( { marginTop, marginRight, marginBottom, marginLeft } ) => ( { marginTop, marginRight, marginBottom, marginLeft } ) )( this.computedStyles );
		if ( toEm ) {
			this.changeObjectUnitsToEm( values );
		}
		values.enabled = false;
		return values;
	}

	/**
	 * Returns padding object
	 *
	 * @param {boolean} toEm Converts to em
	 * @return {object}
	 */
	getPadding( toEm = false ) {
		const values = ( ( { paddingTop, paddingRight, paddingBottom, paddingLeft } ) => ( { paddingTop, paddingRight, paddingBottom, paddingLeft } ) )( this.computedStyles );
		if ( toEm ) {
			this.changeObjectUnitsToEm( values );
		}
		values.enabled = false;
		return values;
	}

	/**
	 * Returns color
	 *
	 * @return {string}
	 */
	getColor() {
		return this.computedStyles.color;
	}

	/**
	 * Returns background color
	 *
	 * @return {string}
	 */
	getBackgroundColor() {
		return this.computedStyles.backgroundColor;
	}

	/**
	 * Returns font size
	 *
	 * @return {float}
	 */
	getFontSize() {
		return parseFloat( this.computedStyles.fontSize, 10 );
	}
}
