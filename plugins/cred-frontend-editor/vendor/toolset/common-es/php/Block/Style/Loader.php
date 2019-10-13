<?php

namespace ToolsetCommonEs\Block\Style;

use ToolsetCommonEs\Block\Style\Block\Factory;
use ToolsetCommonEs\Block\Style\Block\IBlock;
use ToolsetCommonEs\Library\WordPress\Actions as WPActions;

class Loader {
	/** @var Factory  */
	private $block_factory;

	/** @var IBlock[] */
	private $blocks = array();

	/** @var WPActions */
	private $wp_actions;

	/** @var array */
	private $blocks_applied_to_head = array();

	/**
	 * Loader constructor.
	 *
	 * @param Factory $block_factory
	 * @param WPActions $wp_actions
	 */
	public function __construct( Factory $block_factory, WPActions $wp_actions ) {
		$this->block_factory = $block_factory;
		$this->wp_actions    = $wp_actions;

		$this->wp_actions->add_filter( 'render_block', array( $this, 'register_block' ), 10, 2 );
		$this->wp_actions->add_filter( 'wpv_filter_wpv_view_shortcode_output', array( $this, 'views_pagination_content_filter' ), 10, 2 );
		$this->wp_actions->add_action( 'wp', array( $this, 'hook_up_frontend' ) );
		$this->wp_actions->add_filter( 'wpv-pre-do-shortcode', array( $this, 'hook_to_wpv_post_do_shortcode' ) );

		$this->wp_actions->add_filter( 'toolset/dynamic_sources/actions/register_sources', array( $this, 'hook_to_dynamic_sources' ) );
	}

	public function hook_up_frontend() {
		$doing_rest_request = defined( 'REST_REQUEST' ) && REST_REQUEST;

		if( ! $doing_rest_request ) {
			$this->wp_actions->add_filter( 'the_content', array( $this, 'apply_blocks_style_by_script_to_head' ), PHP_INT_MAX - 1, 1 );
		}
	}

	public function hook_to_dynamic_sources() {
		$this->wp_actions->add_filter( 'render_block', array( $this, 'register_block' ), 10, 2 );
		$this->wp_actions->add_filter( 'the_content', array( $this, 'apply_blocks_style_directly' ), PHP_INT_MAX, 1 );
	}

	/**
	 * This is called on 'wpv-pre-do-shortcode'. Simply because REST_REQUEST is not loaded on init.
	 *
	 * @param $content
	 *
	 * @return mixed
	 */
	public function hook_to_wpv_post_do_shortcode( $content ) {
		// only need to hook once
		$this->wp_actions->remove_filter( 'wpv-pre-do-shortcode', array( $this, 'hook_to_wpv_post_do_shortcode' ) );

		// When on admin or on a rest call we need to apply the style directly to the loop item.
		if( is_admin() || ( defined( 'REST_REQUEST' ) && REST_REQUEST ) ) {
			// this is for the preview of Views on posts
			$this->wp_actions->add_filter( 'wpv-post-do-shortcode', array( $this, 'apply_blocks_style_directly' ) );
		}

		// also need to hook to render_block() for collecting block css
		$this->wp_actions->add_filter( 'render_block', array( $this, 'register_block' ), 10, 2 );

		// add 'apply_blocks_style_directly' to views after render hook
		$this->wp_actions->add_filter( 'the_content', array( $this, 'apply_blocks_style_by_script_to_head' ), PHP_INT_MAX - 1, 1 );

		return $content;
	}

	public function apply_blocks_style_by_script_to_head( $content ) {
		$content = $this->block_specific_content_filter( $content );

		$style = '';
		// Reverse blocks. This is important to have inner blocks styles AFTER outer blocks as later applied style
		// has an higher priority. Otherwise the inner blocks style would not be applied.
		$reversed_blocks = array_reverse( $this->blocks );
		foreach( $reversed_blocks as $block ) {
			$this->blocks_applied_to_head[] = $block->get_id();
			$style .= $block->get_css();
		}

		$content = empty( $style )
			? $content
			: '<div id="toolset-blocks-styling-tmp" style="display:none;">' . base64_encode( $style ) . '</div>' . $this->js_to_move_style_to_head() . $content;

		$fonts = $this->block_fonts();
		$font_sets = array();
		foreach( $fonts as $family => $variants ) {
			$font_sets[] = str_replace( ' ', '+', $family ) . ':' . implode( ',', $variants );
		}

		$content = empty( $font_sets ) ?
			$content :
			'<div id="toolset-blocks-styling-font-links-tmp" style="display:none;">' . base64_encode( implode( '###', $font_sets ) ) . '</div>' . $this->js_to_move_fonts_to_head() . $content;

		return $content;
	}

	public function apply_blocks_style_directly( $content ) {
		$content = $this->block_specific_content_filter( $content );

		$fonts = $this->block_fonts();
		$font_sets = array();
		foreach( $fonts as $family => $variants ) {
			$font_sets[] =  str_replace( ' ', '+', $family ) . ':' . implode( ',', $variants );
		}

		$content = empty( $font_sets )
			? $content
			: '<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=' . implode( '|', $font_sets ) . '" />' . $content;

		$style = '';

		// Reverse blocks. This is important to have inner blocks styles AFTER outer blocks as later applied style
		// has an higher priority. Otherwise the inner blocks style would not be applied.
		$reversed_blocks = array_reverse( $this->blocks );
		foreach( $reversed_blocks as $block ) {
			if( in_array( $block->get_id(), $this->blocks_applied_to_head ) ) {
				// already applied to head
				continue;
			}
			$style .= $block->get_css( array(), true );
		}

		$content = empty( $style )
			? $content
			: '<style>'.$style.'</style>' . $content;

		return $content;
	}

	/**
	 * Returns the style of a block.
	 *
	 * @param $block_content
	 * @param \WP_Block_Parser_Block $block The class typing is not part of the parameter list as the parse blocks
	 *                                        parser can be alter by a filter. So it's not really sure if we get
	 *                                        WP_Block_Parser_Block here. Check that params exist before use!
	 *
	 * @return string
	 */
	public function register_block( $block_content, $block ) {
		try {
			$supported_block = $this->block_factory->get_block_by_array( $block );

			if( $supported_block && ! array_key_exists( $supported_block->get_id(), $this->blocks ) ) {
				$this->blocks[ $supported_block->get_id() ] = $supported_block;
			}
		} catch( \Exception $e ) {
			// Something went wrong, which may end in an unexpected display on the frontend.
			// Do nothing.
		}

		return $block_content;
	}

	private function block_specific_content_filter( $content ) {
		foreach( $this->blocks as $block ) {
			$content = $block->filter_content( $content );
		}

		return $content;
	}

	/**
	 * This is required for views ajax pagination. Otherwise DS inside styles (like background of Container) are
	 * not applied on page switches.
	 *
	 * @param $content
	 * @param $id
	 *
	 * @return mixed
	 */
	public function views_pagination_content_filter( $content, $id ) {
		foreach( $this->blocks as $block ) {
			$content = $block->filter_content( $content );
		}

		return $content;
	}

	private function block_fonts() {
		$fonts = array();
		foreach( $this->blocks as $block ) {
			$block_font = $block->get_font();

			if( $block_font ) {
				$family = $block_font['family'];
				$variant = $block_font['variant'];

				if( ! isset( $fonts[ $family ] ) ) {
					// New font.
					$fonts[ $family ] = array( $variant );
				} elseif( ! in_array( $variant, $fonts[ $family ] ) ) {
					// Existing font, but variant is new.
					$fonts[ $family ][] = $variant;
				}
			}
		}

		return $fonts;
	}

	private function js_to_move_style_to_head() {
		return "<script id='toolset-blocks-script-tmp' type='text/javascript'>		
if ( ! document.getElementById( 'toolset-blocks-styling' ) ) {
		document.head.insertAdjacentHTML(
			'beforeend',
			'<style id=\"' + 'toolset-blocks-styling' + '\"></style>' );
	}

    var style = document.getElementById( 'toolset-blocks-styling' );
    var scriptTmp = document.getElementById( 'toolset-blocks-script-tmp' );
	var styleTmp = document.getElementById( 'toolset-blocks-styling-tmp' );
	
	if( style && styleTmp ) {
		style.appendChild( document.createTextNode( window.atob( styleTmp.innerHTML ) ) );
		styleTmp.parentNode.removeChild( styleTmp );
	}
	
	scriptTmp.parentNode.removeChild( scriptTmp );
</script>";
	}

	private function js_to_move_fonts_to_head() {
		return "<script id='toolset-blocks-script-font-tmp' type='text/javascript'>		
    var scriptTmp = document.getElementById( 'toolset-blocks-script-font-tmp' );
	var fontLinksRaw = document.getElementById( 'toolset-blocks-styling-font-links-tmp' );
	
	if( fontLinksRaw ) {
		fontLinks = window.atob( fontLinksRaw.innerHTML ).split( '###' );
		const newLink = document.createElement( 'link' );
			newLink.href = 'https://fonts.googleapis.com/css?family=' + fontLinks.join( '|');
			newLink.rel = 'stylesheet';
		document.head.appendChild( newLink );
	}
	
	scriptTmp.parentNode.removeChild( scriptTmp );
</script>";
	}
}
