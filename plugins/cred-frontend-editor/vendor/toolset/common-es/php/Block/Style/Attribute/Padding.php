<?php
namespace ToolsetCommonEs\Block\Style\Attribute;

class Padding extends Margin {
	public function __construct( $settings ) {
		if(
			! is_array( $settings ) ||
			! array_key_exists( 'enabled', $settings ) ||
			! array_key_exists( 'paddingTop', $settings ) ||
			! array_key_exists( 'paddingRight', $settings ) ||
			! array_key_exists( 'paddingBottom', $settings ) ||
			! array_key_exists( 'paddingLeft', $settings )
		) {
			throw new \InvalidArgumentException( 'Invalid attribtue array.' . print_r( $settings, true ) );
		}

		$this->enabled = $settings['enabled'] ? true : false;
		$this->top = $this->string_as_number_with_unit( $settings['paddingTop'] );
		$this->right = $this->string_as_number_with_unit( $settings['paddingRight'] );
		$this->bottom = $this->string_as_number_with_unit( $settings['paddingBottom'] );
		$this->left = $this->string_as_number_with_unit( $settings['paddingLeft'] );
	}
	
	public function get_name() {
		return 'padding';
	}
}
