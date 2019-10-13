<?php

namespace ToolsetCommonEs\Block\Style\Attribute;

/**
 * Class Factory
 *
 * Creates Attribute Object
 *
 * @package ToolsetCommonEs\Block\Style\Attribute
 */
class Factory {
	/**
	 * Returns an object of IAttribute by given name and settings
	 *
	 * @param string $name
	 * @param array $settings
	 *
	 * @return IAttribute
	 */
	public function get_attribute( $name, $settings ) {
		try {
			// generalise style name
			$name = strtolower( str_replace( '-', '', $name ) );

			switch( $name ) {
				case 'background':
					return new Background( $settings );
				case 'backgroundcolor':
					return new BackgroundColor( $settings );
				case 'border':
					$top = $this->get_border_side( 'top', $settings );
					$right = $this->get_border_side( 'right', $settings );
					$bottom = $this->get_border_side( 'bottom', $settings );
					$left = $this->get_border_side( 'left', $settings );
					return new Border( $top, $right, $bottom, $left );
				case 'borderradius':
					return new BorderRadius( $settings );
				case 'boxshadow':
					return new BoxShadow( $settings );
				case 'textcolor':
				case 'color':
					return new Color( $settings );
				case 'content':
					return new Content( $settings );
				case 'fontfamily':
					return new FontFamily( $settings );
				case 'fontweight':
					return new FontWeight( $settings );
				case 'fontstyle':
					return new FontStyle( $settings );
				case 'fontsize':
					return new FontSize( $settings );
				case 'height':
					return new Height( $settings );
				case 'lineheight':
					return new LineHeight( $settings );
				case 'letterspacing':
					return new LetterSpacing( $settings );
				case 'margin':
					return new Margin( $settings );
				case 'maxwidth':
					return new MaxWidth( $settings );
				case 'padding':
					return new Padding( $settings );
				case 'rotate':
					return new Rotate( $settings );
				case 'textalign':
					return new TextAlign( $settings );
				case 'textdecoration':
					return new TextDecoration( $settings );
				case 'texttransform':
					return new TextTransform( $settings );
				case 'textshadow':
					return new TextShadow( $settings );
				case 'top':
					return new Top( $settings );
				case 'width':
					return new Width( $settings );
				case 'scale':
					return new Scale( $settings );
				case 'zindex':
					return new ZIndex( $settings );
				default:
					return;
			}
		} catch( \Exception $e ) {
			// Attribute could not be build.
			// error_log( 'EXCEPTION: ' . $e->getMessage() . '<br />' . $e->getFile());
			return;
		}
	}

	public function get_attribute_width( $width, $unit ) {
		return $this->get_attribute( 'width', array( 'width' => $width, 'widthUnit' => $unit ) );
	}

	public function get_attribute_max_width( $width, $unit ) {
		return $this->get_attribute( 'max-width', array( 'width' => $width, 'widthUnit' => $unit ) );
	}

	public function get_attribute_height( $height, $unit ) {
		return $this->get_attribute( 'height', array( 'height' => $height, 'heightUnit' => $unit ) );
	}

	public function load_common_attributes_by_array( $config, $styles_key = 'style' ) {
		$attributes = array();

		if( ! is_array( $config ) ) {
			return $attributes;
		}

		/** Style container common attributes */
		if( array_key_exists( $styles_key, $config ) ) {
			$styles_config = $config[ $styles_key ];

			// Normalise some storages which are not bundled inside an array.
			// Line Height.
			if( isset( $styles_config[ 'lineHeight'] ) && isset( $styles_config['lineHeightUnit'] ) ) {
				$styles_config['lineHeight'] = array(
					'size' => $styles_config['lineHeight'],
					'unit' => $styles_config['lineHeightUnit']
				);

				unset( $styles_config['lineHeightUnit'] );
			}

			// Letter Spacing.
			if( isset( $styles_config[ 'letterSpacing'] ) && isset( $styles_config['letterSpacingUnit'] ) ) {
				$styles_config['letterSpacing'] = array(
					'size' => $styles_config['letterSpacing'],
					'unit' => $styles_config['letterSpacingUnit']
				);

				unset( $styles_config['letterSpacingUnit'] );
			}

			// Font, including font variant.
			if( isset( $styles_config['font'] ) ) {
				$styles_config['fontFamily'] = $styles_config[ 'font' ];

				if(
					! isset( $styles_config['fontWeight'] )
					&& isset( $styles_config['fontVariant'] ) && $styles_config['fontVariant'] !== 'regular'
				) {
					// If 'bold' is not used and fontVariant is not 'regular', use it as fontWeight.
					$styles_config['fontWeight'] = $styles_config['fontVariant'];
				}
			}


			foreach( $styles_config as $key => $value ) {
				$key = $key == 'font' ? 'fontFamily' : $key;
				$key = $key == 'fontVariant' ? 'fontWeight' : $key;

				$style = $this->get_attribute( $key, $value );

				if( $style ) {
					$attributes[] = $style;
				}
			}
		}

		return $attributes;
	}

	/**
	 * @param $side
	 * @param $settings
	 *
	 * @return null|BorderSide
	 */
	private function get_border_side( $side, $settings ) {
		if( ! is_array( $settings ) || ! array_key_exists( $side, $settings ) ) {
			return null;
		}

		return new BorderSide( $side, $settings[ $side ] );
	}
}
