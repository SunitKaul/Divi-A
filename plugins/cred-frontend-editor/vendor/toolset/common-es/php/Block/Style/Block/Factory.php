<?php

namespace ToolsetCommonEs\Block\Style\Block;

use \ToolsetCommonEs\Block\Style\Attribute\Factory as FactoryStyleAttribute;

/**
 * Class Factory
 *
 * Maps block array comming from WordPress to our Style/Block class. The array can be filtered, so it's important
 * to prove every key before use.
 *
 * @package ToolsetCommonEs\Block\Style\Block
 */
class Factory {
	/** @var FactoryStyleAttribute */
	private $factory_style_attribute;

	/** @var IFactory[]  */
	private $block_factories = array();

	public function __construct( FactoryStyleAttribute $factory_attribute ) {
		$this->factory_style_attribute = $factory_attribute;
	}

	/**
	 * A block factory is useful to build blocks which are not directly provided by CommonES (all blocks for now).
	 * The function get_block_by_array() will loop over every sub factory to find a matching block.
	 *
	 * @param IFactory $sub_factory
	 */
	public function add_block_factory( IFactory $sub_factory ) {
		$this->block_factories[] = $sub_factory;
	}

	/**
	 * Returns an array of ToolsetCommonEs\Block\Style\Block by given object.
	 *
	 * @param array $array
	 *
	 * @return IBlock
	 */
	public function get_block_by_array( $array ) {
		if(
			! is_array( $array ) ||
			! array_key_exists( 'blockName', $array ) ||
			! array_key_exists( 'attrs', $array )
		) {
			return;
		}

		$block = false;

		foreach( $this->block_factories as $block_factory ) {
			if( $block = $block_factory->get_block_by_array( $array ) ) {
				// Block found, break out of loop.
				break;
			}
		}

		if( ! $block ) {
			// No Block provided by the sub factories.
			return;
		}

		$this->load_styles_attributes( $block );
		$block->set_name( $array['blockName'] );
		$block->make_use_of_inner_html( $array['innerHTML'] );
		return $block;
	}

	/**
	 * The common style is stored indentically on all blocks.
	 *
	 * @param IBlock $block
	 */
	protected function load_styles_attributes( IBlock $block ){
		// Styles provided by the "Style Settings" section
		$styles = $this->factory_style_attribute->load_common_attributes_by_array( $block->get_block_config() );

		if( ! empty( $styles ) ) {
			foreach( $styles as $style ) {
				$block->add_style_attribute( $style );
			}
		}

		// Styles of the Container
		$styles = $this->factory_style_attribute->load_common_attributes_by_array( $block->get_block_config(), 'container' );

		if( ! empty( $styles ) ) {
			foreach( $styles as $style ) {
				$block->add_style_attribute( $style, ABlock::KEY_STYLES_FOR_CONTAINER );
			}
		}

		$block->load_block_specific_style_attributes( $this->factory_style_attribute );
	}
}
