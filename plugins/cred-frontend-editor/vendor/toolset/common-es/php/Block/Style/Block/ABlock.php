<?php

namespace ToolsetCommonEs\Block\Style\Block;

use ToolsetCommonEs\Block\Style\Attribute\IAttribute;

abstract class ABlock implements IBlock {
	/**
	 * 'root' is an alias for the current block root element selector, which is a combination of name + clientId.
	 * @var string
	 */
	const CSS_SELECTOR_ROOT = 'root';

	/**
	 * 'common' styles holds all css attributes which are provided Toolset Common ES > Style Control Composition
	 * Most blocks are not using more than this common styles selection.
	 * @var string
	 */
	const KEY_STYLES_FOR_COMMON_STYLES = 'common';

	/**
	 * 'container' holds all css attributes which are provided Toolset Common ES > Container
	 * @var string
	 */
	const KEY_STYLES_FOR_CONTAINER = 'container';

	/** @var the id is build by using the clientId */
	private $id;

	/** @var string */
	private $name;

	/** @var array */
	private $block_config = array();

	/** @var IAttribute[] */
	private $style_attributes = array();

	/** @var bool */
	private $is_applied = false;

	/**
	 * ABlock constructor.
	 *
	 * @param $block_config
	 */
	public function __construct( $block_config ) {
		if( ! is_array( $block_config ) || ! array_key_exists( 'blockId', $block_config ) ) {
			throw new \InvalidArgumentException( 'Given array is not compatible.' );
		}

		$this->set_id( $block_config['blockId'] );
		$this->set_block_config( $block_config );
	}

	/**
	 * Apply a style attribute.
	 *
	 * @param IAttribute $style_attribute
	 * @param string $group
	 */
	public function add_style_attribute( IAttribute $style_attribute, $group = self::KEY_STYLES_FOR_COMMON_STYLES ) {
		$this->style_attributes[$group][ $style_attribute->get_name() ] = $style_attribute;
	}

	/**
	 * The ID of the Block.
	 * @return string
	 */
	public function get_id() {
		return $this->id;
	}

	/**
	 * @param $name
	 */
	public function set_name( $name ) {
		if( is_string( $name ) ) {
			$this->name = $name;
		}
	}

	/**
	 * @return string
	 */
	public function get_name() {
		return $this->name;
	}

	/**
	 * @return array
	 */
	public function get_block_config() {
		return $this->block_config;
	}

	/**
	 * @param $content
	 *
	 * @return mixed
	 */
	public function filter_content( $content ) {
		return $content;
	}

	/**
	 * @param array $config Optional to determine on which element css should go. If no config is given all styles will
	 *                        be applied to the root element.
	 *
	 *                        [self::CSS_SELECTOR_ROOT] =>
	 *                            [KEY_STYLES_FOR_COMMON_STYLES] => [ 'box-shadow', 'border' ]
	 *                        ['.a-css-selector' ]
	 *                            [KEY_STYLES_FOR_COMMON_STYLES] => [ 'background-color' ]
	 *
	 *                        This will apply 'box-shadow' and 'border' from 'common' to the root element
	 *                        and 'background-color' from 'common' to "[root] .a-css-selector".
	 *
	 *                        See ./Image.php for a real example.
	 *
	 * @param bool $force_apply
	 *
	 * @return string
	 */
	public function get_css( $config = array(), $force_apply = false ) {
		if( $this->is_applied() && ! $force_apply ) {
			return '';
		}

		$this->mark_as_applied();
		$styles = $this->get_style_attributes();

		if( empty( $styles ) ) {
			return '';
		}

		if( empty( $config ) ) {
			return $this->get_css_container() . $this->get_all_css_for_root_element( $styles );
		}

		$css = '';

		foreach( $config as $css_selector => $style_groups ) {
			$css_selector_styles = '';
			$css_selector_transform_styles = array();

			foreach( $style_groups as $style_group_key => $styles_keys ) {
				foreach( $styles_keys as $style_key ) {
					if( ! $style = $this->get_style_of_styles_by_key( $styles, $style_group_key, $style_key ) ) {
						continue;
					}

					if( $style->is_transform() ) {
						$css_selector_transform_styles[] = $style->get_css();
					} else {
						$css_selector_styles .= $style->get_css();
					}
				}
			}

			if( ! empty( $css_selector_transform_styles ) ) {
				$css_selector_styles .= 'transform: ' . implode( ' ', $css_selector_transform_styles ) .';';
			}

			$css .= ! empty( $css_selector_styles ) ?
				 $this->get_css_selector( $css_selector ) . ' { ' . $css_selector_styles . ' } ' :
				'';
		}

		return $this->get_css_container() . $css;
	}

	public function get_font() {
		$config = $this->get_block_config();

		if( empty( $config ) ||
			! array_key_exists( 'style', $config ) ||
			! is_array( $config['style'] ) ||
			! array_key_exists( 'font', $config['style'] )
		) {
			return false;
		}

		return array(
			'family' => $config['style']['font'],
			'variant' => isset( $config['style']['fontVariant'] ) ?
				$config['style']['fontVariant'] :
				'regular'
		);
	}

	public function make_use_of_inner_html( $inner_html ) {
		// Some blocks require their inner html for style rendering.
	}

	/**
	 * @return string
	 */
	public function get_css_block_class() {
		return '';
	}

	/**
	 * @param $styles
	 * @param $style_group_key
	 * @param $key
	 *
	 * @return IAttribute|null
	 */
	private function get_style_of_styles_by_key( $styles, $style_group_key, $key ) {
		if(
			is_array( $styles ) &&
			array_key_exists( $style_group_key, $styles ) &&
			is_array( $styles[ $style_group_key ] ) &&
			array_key_exists( $key, $styles[ $style_group_key ] )
		) {
			return $styles[ $style_group_key ][$key];
		}

		return null;
	}

	private function get_css_container() {
		$styles = $this->get_style_attributes();

		if( empty( $styles ) ||
		    ! array_key_exists( self::KEY_STYLES_FOR_CONTAINER, $styles ) ||
			empty( $styles[ self::KEY_STYLES_FOR_CONTAINER ] )
		) {
			return '';
		}
		$css_selector_styles = '';
		$css_selector_transform_styles = array();
		foreach( $styles[ self::KEY_STYLES_FOR_CONTAINER ] as $style ) {
			if( $style->is_transform() ) {
				$css_selector_transform_styles[] = $style->get_css();
			} else {
				$css_selector_styles .= $style->get_css();
			}
		}

		if( ! empty( $css_selector_transform_styles ) ) {
			$css_selector_styles .= 'transform: ' . implode( ' ', $css_selector_transform_styles ) .';';
		}

		return ! empty( $css_selector_styles ) ?
			$this->get_css_selector_container() . ' { ' . $css_selector_styles . ' } ' :
			'';
	}

	/**
	 * @param $styles
	 * @return string
	 */
	private function get_all_css_for_root_element( $styles ) {
		$css = '';
		$transform_css = array();
		foreach( $styles as $group => $style_groups ) {
			/** @var IAttribute $style */
			foreach( $style_groups as $style) {
				if( $style->is_transform() ) {
					$transform_css[] = $style->get_css();
				} else {
					$css .= $style->get_css();
				}
			}
		}

		if( ! empty( $transform_css ) ) {
			$css .= 'transform: ' . implode( ', ', $transform_css ) . ';';
		}

		return ! empty( $css ) ? $this->get_css_selector() . '{ ' . $css . ' } ' : '';
	}

	/**
	 * @param string $css_selector
	 *
	 * @return string
	 */
	protected function get_css_selector( $css_selector = self::CSS_SELECTOR_ROOT ) {
		// Root selector
		$root_css_selector = $this->get_css_selector_root();

		$css_selectors = explode( '!', $css_selector );

		$selectors = array();

		foreach( $css_selectors as $selector ) {
			// Determine css selector. If it's root there is no extra css selector required.
			$selector = $selector === self::CSS_SELECTOR_ROOT ? '' : $selector;
			$selector = empty( $selector ) || substr( $selector, 0, 1 ) == ':' ? $selector : ' ' . $selector;

			$selectors[] = $root_css_selector . $selector;
		}

		return implode( ', ', $selectors );
	}

	protected function get_css_selector_root() {
		return $this->get_css_block_class() . '[data-' . str_replace( '/', '-', $this->get_name() ) . '="' . $this->get_id() . '"]';
	}

	protected function get_css_selector_container() {
		return '[data-tb-container="' . $this->get_id() . '"]';
	}

	/**
	 * @return IAttribute[]
	 */
	protected function get_style_attributes() {
		return $this->style_attributes;
	}

	/**
	 * Set ID of the Block.
	 * @param $id
	 */
	protected function set_id( $id ){
		$this->id = $id;
	}

	/**
	 * Returns true when the block is already applied.
	 *
	 * @return bool
	 */
	protected function is_applied() {
		return $this->is_applied;
	}

	/**
	 * Mark the block as applied.
	 */
	protected function mark_as_applied() {
		$this->is_applied = true;
	}

	/**
	 * Set the Block Config. Usually the raw config of what is stored on the block.
	 * @param $block_config
	 */
	protected function set_block_config( $block_config ) {
		if( is_array( $block_config ) ) {
			$this->block_config = $block_config;
		}
	}
}
