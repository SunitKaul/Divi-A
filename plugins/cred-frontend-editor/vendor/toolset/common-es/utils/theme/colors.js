/**
 * Common defaults with fallbacks for controls used in Toolset Blocks. (When the theme doesn't provide its own.)
 *
 * @since 1.0
 */

import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';

const fallbackColors = [
	{
		color: '#444',
		name: __( 'Very dark gray', 'wpv-views' ),
		slug: 'primary',
	},
	{
		color: '#f1f1f1',
		name: __( 'Light gray', 'wpv-views' ),
		slug: 'light-gray',
	},
	{
		color: '#c1c1c1',
		name: __( 'Gray', 'wpv-views' ),
		slug: 'gray',
	},
	{
		color: '#2e4580',
		name: __( 'Navy', 'wpv-views' ),
		slug: 'navy',
	},
	{
		color: '#47a5bf',
		name: __( 'Blue', 'wpv-views' ),
		slug: 'blue',
	},
	{
		color: '#43c4b0',
		name: __( 'Mint', 'wpv-views' ),
		slug: 'mint',
	},
	{
		color: '#4faf4f',
		name: __( 'Green', 'wpv-views' ),
		slug: 'green',
	},
	{
		color: '#e4cc29',
		name: __( 'Yellow', 'wpv-views' ),
		slug: 'yellow',
	},
	{
		color: '#da552a',
		name: __( 'Red', 'wpv-views' ),
		slug: 'red',
	},
	{
		color: '#ea6181',
		name: __( 'Pink', 'wpv-views' ),
		slug: 'pink',
	},
];

/**
 * Gives either color palette from theme or our fallback.
 *
 * @since 1.0
 * @return {Array}
 */
const colors = () => {
	if ( select( 'core/editor' ).getEditorSettings().colors ) {
		return select( 'core/editor' ).getEditorSettings().colors;
	}
	return fallbackColors;
};

export default colors;
