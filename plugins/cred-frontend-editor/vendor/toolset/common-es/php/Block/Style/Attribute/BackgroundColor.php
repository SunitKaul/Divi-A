<?php
namespace ToolsetCommonEs\Block\Style\Attribute;

class BackgroundColor extends AAttribute {
	private $hex_color;

	public function __construct( $value ) {
		$this->hex_color = $this->string_as_hex_color( $value );
	}

	public function get_name() {
		return 'background-color';
	}

	/**
	 * @return string
	 */
	public function get_css() {
		if( empty( $this->hex_color ) ) {
			return '';
		}

		return "background-color: $this->hex_color;";
	}
}
