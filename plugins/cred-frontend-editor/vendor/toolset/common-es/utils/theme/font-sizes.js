import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';

const fallbackFontSizes = [
	{
		name: __( 'XXS', 'wpv-views' ),
		shortName: __( 'XXS', 'wpv-views' ),
		slug: 'xxxs',
		size: 6,
	},
	{
		name: __( 'XS', 'wpv-views' ),
		shortName: __( 'XS', 'wpv-views' ),
		slug: 'xs',
		size: 8,
	},
	{
		name: __( 'Small', 'wpv-views' ),
		shortName: __( 'S', 'wpv-views' ),
		slug: 's',
		size: 10,
	},
	{
		name: __( 'Medium', 'wpv-views' ),
		shortName: __( 'M', 'wpv-views' ),
		slug: 'm',
		size: 12,
	},
	{
		name: __( 'Big', 'wpv-views' ),
		shortName: __( 'L', 'wpv-views' ),
		slug: 'l',
		size: 16,
	},
	{
		name: __( 'XL', 'wpv-views' ),
		shortName: __( 'XL', 'wpv-views' ),
		slug: 'xl',
		size: 24,
	},
	{
		name: __( 'XXL', 'wpv-views' ),
		shortName: __( 'XXL', 'wpv-views' ),
		slug: 'xxl',
		size: 36,
	},
	{
		name: __( 'XXXL', 'wpv-views' ),
		shortName: __( 'XXXL', 'wpv-views' ),
		slug: 'xxxl',
		size: 48,
	},
];

/**
 * Gives either font sizes from theme or our fallbacks.
 *
 * @since 1.0
 * @return {Array}
 */
const fontSizes = () => {
	if ( select( 'core/editor' ).getEditorSettings().fontSizes ) {
		return select( 'core/editor' ).getEditorSettings().fontSizes;
	}
	return fallbackFontSizes;
};

export default fontSizes;
