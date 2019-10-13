<?php
namespace ToolsetCommonEs\Block\Style\Attribute;

class Margin extends AAttribute {
	protected $enabled;
	protected $top;
	protected $right;
	protected $bottom;
	protected $left;

	public function __construct( $settings ) {
		if(
			! is_array( $settings ) ||
			! array_key_exists( 'enabled', $settings ) ||
			! array_key_exists( 'marginTop', $settings ) ||
			! array_key_exists( 'marginRight', $settings ) ||
			! array_key_exists( 'marginBottom', $settings ) ||
			! array_key_exists( 'marginLeft', $settings )
		) {
			throw new \InvalidArgumentException( 'Invalid attribtue array.' . print_r( $settings, true ) );
		}

		$this->enabled = $settings['enabled'] ? true : false;
		$this->top = $this->string_as_number_with_unit( $settings['marginTop'] );
		$this->right = $this->string_as_number_with_unit( $settings['marginRight'] );
		$this->bottom = $this->string_as_number_with_unit( $settings['marginBottom'] );
		$this->left = $this->string_as_number_with_unit( $settings['marginLeft'] );
	}

	public function get_name() {
		return 'margin';
	}

	/**
	 * @return string
	 */
	public function get_css() {
		if( ! $this->enabled ) {
			return '';
		}

		if( $this->top === null &&
			$this->right === null &&
			$this->bottom === null &&
			$this->left === null
		) {
			// no margin
			return '';
		}

		if( $this->top === $this->right &&
			$this->right === $this->left &&
			$this->left === $this->bottom
		) {
			// all sides have the same value
			return $this->get_name() . ': ' . $this->top. ';';
		}

		if( $this->top !== null &&
			$this->right !== null &&
			$this->bottom !== null &&
			$this->left !== null
		) {
			// all corners are set, but different
			return $this->get_name() . ': ' . $this->top
				. ' ' . $this->right
				. ' ' . $this->bottom
				. ' ' . $this->left
				. ';';
		}

		// each side is different and not all are set, check one by one.
		$individual_styles = '';

		if( $this->top !== null ) {
			$individual_styles .= $this->get_name() . '-top: ' . $this->top . ';';
		}
		if( $this->right !== null ) {
			$individual_styles .= $this->get_name() . '-right: ' . $this->right . ';';
		}
		if( $this->bottom !== null ) {
			$individual_styles .= $this->get_name() . '-bottom: ' . $this->bottom . ';';
		}
		if( $this->left !== null ) {
			$individual_styles .= $this->get_name() . '-left: ' . $this->left . ';';
		}

		return $individual_styles;
	}
}
