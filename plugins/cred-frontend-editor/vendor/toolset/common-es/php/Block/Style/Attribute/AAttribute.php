<?php

namespace ToolsetCommonEs\Block\Style\Attribute;


abstract class AAttribute implements IAttribute {
	public function is_transform() {
		return false;
	}

	protected function zero_or_with_px( $value ) {
		$value = intval( $value );
		return $value > 0 ? $value . 'px' : 0;
	}

	protected function string_as_number_with_unit( $value, $default_unit = 'px' ) {
		$value = strtolower( str_replace( ' ', '', $value ) );
		if( preg_match( '#([\-0-9\.]{1,})(em|ex|%|px|cm|mm|in|pt|pc|ch|rem|vh|vw)?#', $value, $matches ) ) {
			$number = $matches[1];
			$unit = isset( $matches[2] ) ? $matches[2] : $default_unit;

			return $number.$unit;
		}

		return null;
	}

	protected function string_as_hex_color( $value ) {
		$value = trim( $value );
		$length = strlen( $value );

		if( $length !== 4 && $length !== 7 ) {
			return null;
		}

		$value = strtolower( $value );

		return preg_matcH( '/#([a-f0-9]{3}){1,2}/', $value ) ? $value : null;
	}
}
