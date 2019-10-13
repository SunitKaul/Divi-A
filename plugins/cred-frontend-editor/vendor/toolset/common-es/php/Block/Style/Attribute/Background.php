<?php
namespace ToolsetCommonEs\Block\Style\Attribute;

class Background extends AAttribute {
	private $type;
	private $settings;

	public function __construct( $settings ) {
		if( ! is_array( $settings ) || ! array_key_exists( 'type', $settings ) ) {
			return '';
		}

		$this->settings = $settings;
		$this->type = strtolower( $settings['type'] );
	}

	public function get_name() {
		return 'background';
	}

	/**
	 * @return string
	 */
	public function get_css() {
		switch( $this->type ) {
			case 'solid':
				return $this->get_css_solid();
			case 'gradient':
				return $this->get_css_gradient();
			case 'image':
				return $this->get_css_image();
			default:
				return '';
		}
	}

	private function get_css_solid() {
		if( ! $hex_color = $this->get_deep_prop_of_settings( array( 'solid', 'color', 'hex' ) ) ) {
			return '';
		}

		return "background-color: $hex_color;";
	}

	private function get_css_gradient() {
		if( ! $type = $this->get_deep_prop_of_settings( array( 'gradient', 'type' ) ) ) {
			return '';
		}

		$style_type = $type === 'linear' ?
			'linear-gradient' :
			'radial-gradient';

		$style_values = array();

		if( $repeating = $this->get_deep_prop_of_settings( array( 'gradient', 'repeating') ) ) {
			$style_type = 'repeating-' . $style_type;
		}

		if ( $type === 'linear' && $angel = $this->get_deep_prop_of_settings( array( 'gradient', 'angle' ) ) ) {
			array_push( $style_values, $angel . 'deg' );
		}
		else if ( $type === 'radial' && $form = $this->get_deep_prop_of_settings( array( 'gradient', 'form' ) ) ) {
			if( $form !== 'ellipse' ) { // Ellipse is default, no need to apply that.
				array_push( $style_values, $form );
			}
		}

		$colors = $this->get_deep_prop_of_settings( array( 'gradient', 'colors' ) );
		$first_color_stop = 0;
		$colors_last_index = count( $colors ) - 1;

		foreach( $colors as $index => $color ) {
			if( ! array_key_exists( 'rgb', $color ) ) {
				continue;
			}

			$rgb = $color['rgb'];

			if(
				! array_key_exists( 'r', $rgb ) ||
				! array_key_exists( 'g', $rgb ) ||
				! array_key_exists( 'b', $rgb ) ||
				! array_key_exists( 'a', $rgb )
			) {
				continue;
			}

			$style_color = 'rgba( ' . $rgb['r'] . ', ' . $rgb['g'] . ', ' . $rgb['b'] . ', ' . $rgb['a'] . ' )';

			// When repeating is used, it needs to be applied to the last color.
			if ( $repeating && $colors_last_index === $index ) {
				$style_color .= ' ' . $repeating + $first_color_stop . '%';
			} else if( array_key_exists( 'stop', $color ) ) {
				$stop_with_repeating = $this->stop_position_relative_to_repeating_range( $color['stop'], $repeating );

				if( $index === 0 ) {
					$first_color_stop = $stop_with_repeating;
				}

				$style_color .= ' ' . $stop_with_repeating . '%';
			}

			array_push( $style_values, $style_color );
		}

		return 'background-image:' . $style_type . '( ' . implode( ',', $style_values ) . ' );';
	}

	private function stop_position_relative_to_repeating_range( $stop, $repeating ) {
		if ( ! $repeating ) {
			return $stop;
		}

		$intStop = intval( $stop );
		$intRepeating = intval( $repeating );
		$stopRelativeToRepeating = intval( $intRepeating / 100 * $intStop );

		if ( $stopRelativeToRepeating > $intRepeating ) {
			return $intRepeating;
		}

		return $stopRelativeToRepeating;
	}

	private function get_css_image() {
		$color = $this->get_deep_prop_of_settings( array( 'image', 'color' ), '' );

		if( ! empty( $color ) ) {
			$color = '';

			$r = $this->get_deep_prop_of_settings( array( 'image', 'color', 'rgb', 'r' ), false );
			$g = $this->get_deep_prop_of_settings( array( 'image', 'color', 'rgb', 'g' ), false );
			$b = $this->get_deep_prop_of_settings( array( 'image', 'color', 'rgb', 'b' ), false );
			$a = $this->get_deep_prop_of_settings( array( 'image', 'color', 'rgb', 'a' ), false );

			if( $r !== false && $g !== false && $b !== false && $a !== false ) {
				$color = 'rgba( ' . $r . ', ' . $g . ', ' . $b . ', ' . $a . ' )';
			}
		}

		$url = $this->get_deep_prop_of_settings( array( 'image', 'url' ), '' );

		$style_values = array();

		// overlay
		$has_overlay = false;
		$or = $this->get_deep_prop_of_settings( array( 'image', 'overlayColor', 'rgb', 'r' ), false );
		$og = $this->get_deep_prop_of_settings( array( 'image', 'overlayColor', 'rgb', 'g' ), false );
		$ob = $this->get_deep_prop_of_settings( array( 'image', 'overlayColor', 'rgb', 'b' ), false );
		$oa = $this->get_deep_prop_of_settings( array( 'image', 'overlayColor', 'rgb', 'a' ), false );

		if( $or !== false && $og !== false && $ob !== false && $oa !== false ) {
			$has_overlay = true;
			$rgba = 'rgba( ' . $or . ', ' . $og . ', ' . $ob . ', ' . $oa . ' )';
			$style_values[] = 'linear-gradient(' . $rgba . ',' . $rgba . '), ';
		}

		$style_values[] = $color;

		// url
		$style_values[] = "url('$url')";

		// position
		if( $horizontal = $this->get_deep_prop_of_settings( array( 'image', 'horizontal', 'position' ) ) ){
			if( $horizontal === 'custom' ) {
				$value = $this->get_deep_prop_of_settings( array( 'image', 'horizontal', 'value' ) );
				$unit = $this->get_deep_prop_of_settings( array( 'image', 'horizontal', 'unit' ) );

				$horizontal = $value ? $value . $unit : 'center';
			}
		}

		$horizontal = $horizontal ? $horizontal : 'center';

		if( $this->get_deep_prop_of_settings( array( 'image', 'attachment' ) ) === 'fixed' ) {
			$vertical = 'top';
		} else if( $vertical = $this->get_deep_prop_of_settings( array( 'image', 'vertical', 'position' ) ) ) {
			if( $vertical === 'custom' ) {
				$value = $this->get_deep_prop_of_settings( array( 'image', 'vertical', 'value' ) );
				$unit = $this->get_deep_prop_of_settings( array( 'image', 'vertical', 'unit' ) );

				$vertical = $value ? $value . $unit : 'center';
			}
		}

		$vertical = $vertical ? $vertical : 'center';

		if ( $horizontal !== 'left' || $vertical !== 'top' ) {
			$style_values[] = "$horizontal $vertical";
		}

		// repeat
		if( $repeat = $this->get_deep_prop_of_settings( array( 'image', 'repeat' ), 'no-repeat' ) ){
			$style_values[] = $repeat;
		}

		$backgroundStyle = 'background:' . implode( ' ', $style_values ) . ';';

		// size
		if( ! $size = $this->get_deep_prop_of_settings( array( 'image', 'size' ), 'cover' ) ) {
			// no size, return "background" style only
			return $backgroundStyle;
		}

		if( $size !== 'auto' && $size !== 'custom' ) {
			// keyword used ("cover", "contain"...)
			$size = $has_overlay ? 'auto, '. $size : $size;
			return $backgroundStyle . 'background-size:' . $size . ';';
		}

		$width = $this->get_deep_prop_of_settings( array( 'image', 'width' ), 'auto' );
		$widthUnit = $this->get_deep_prop_of_settings( array( 'image', 'widthUnit' ), 'px' );
		$height = $this->get_deep_prop_of_settings( array( 'image', 'height' ), 'auto' );
		$heightUnit = $this->get_deep_prop_of_settings( array( 'image', 'heightUnit' ), 'px' );

		$styleWidth = $width !== 'auto' ?
			$width . $widthUnit :
			'auto';

		$styleHeight = $height !== 'auto' ?
			$height . $heightUnit :
			'auto';


		if( $styleWidth !== 'auto' || $styleHeight !== 'auto' ) {
			// custom size
			return $backgroundStyle . "background-size: $styleWidth $styleHeight;";
		}

		return $backgroundStyle;
	}

	/**
	 * @param $route
	 *
	 * @param bool $default
	 *
	 * @return mixed
	 */
	private function get_deep_prop_of_settings( $route, $default = false ) {
		$settings = $this->settings;
		foreach( $route as $key ) {
			if( ! array_key_exists( $key, $settings ) ) {
				return $default;
			}

			$settings = $settings[ $key ];
		}

		return $settings;
	}
}
