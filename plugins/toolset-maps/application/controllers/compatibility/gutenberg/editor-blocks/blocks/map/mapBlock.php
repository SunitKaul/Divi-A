<?php
namespace OTGS\Toolset\Maps\Controller\Compatibility;

use Toolset_Addon_Maps_Common;
use Toolset_Addon_Maps_Views;

class MapBlock extends \Toolset_Gutenberg_Block {

	const BLOCK_NAME = 'toolset/map';

	/**
	 * Block initialization.
	 *
	 * @return void
	 */
	public function init_hooks() {
		// These need to happen one after another, and all after initializing DS API
		add_action( 'init', array( $this, 'register_block_editor_assets' ), 20 );
		add_action( 'init', array( $this, 'register_block_type' ), 30 );
	}

	/**
	 * Block editor asset registration.
	 *
	 * @return void
	 */
	public function register_block_editor_assets() {
		$editor_script_dependencies = array(
			'wp-editor',
			'lodash',
			'jquery',
			'views-addon-maps-script',
			'wp-blocks',
			'wp-i18n',
			'wp-element',
			// Using literal instead of Toolset\DynamicSources\DynamicSources::TOOLSET_DYNAMIC_SOURCES_SCRIPT_HANDLE
			// because that would be the only dependency on that class, and in some circumstances WP will needlessly
			// call this without calling our block factory where the autoloader for DS is registered.
			'toolset_dynamic_sources_script',
		);
		$api_used = apply_filters( 'toolset_maps_get_api_used', '' );

		if ( Toolset_Addon_Maps_Common::API_GOOGLE === $api_used ) {
			array_push(
				$editor_script_dependencies,
				'marker-clusterer-script',
				'overlapping-marker-spiderfier'
			);
		};

		$this->toolset_assets_manager->register_script(
			'toolset-map-block-js',
			TOOLSET_ADDON_MAPS_URL . MapsEditorBlocks::TOOLSET_MAPS_BLOCKS_ASSETS_RELATIVE_PATH . '/js/map.block.editor.js',
			$editor_script_dependencies,
			TOOLSET_ADDON_MAPS_VERSION
		);

		wp_localize_script(
			'toolset-map-block-js',
			'toolset_map_block_strings',
			array(
				'blockName' => self::BLOCK_NAME,
				'blockCategory' => \Toolset_Blocks::TOOLSET_GUTENBERG_BLOCKS_CATEGORY_SLUG,
				'mapCounter' => $this->get_map_counter(),
				'markerCounter' => $this->get_marker_counter(),
				'api' => $api_used,
				'apiKey' => $this->is_the_right_api_key_entered(),
				'settingsLink' => Toolset_Addon_Maps_Common::get_settings_link(),
				'themeColors' => get_theme_support( 'editor-color-palette' ),
				'mapDefaultSettings' => Toolset_Addon_Maps_Common::$map_defaults,
				'mapStyleOptions' => Toolset_Addon_Maps_Common::get_style_options(),
				'markerOptions' => apply_filters( 'toolset_maps_views_get_marker_options', array() ),
				'isFrontendServerOverHttps' => $this->is_frontend_served_over_https(),
			)
		);

		$this->toolset_assets_manager->register_style(
			'toolset-map-block-editor-css',
			TOOLSET_ADDON_MAPS_URL . MapsEditorBlocks::TOOLSET_MAPS_BLOCKS_ASSETS_RELATIVE_PATH . '/css/map.block.editor.css',
			array(),
			TOOLSET_ADDON_MAPS_VERSION
		);
	}

	/**
	 * Server side block registration.
	 *
	 * @return void
	 */
	public function register_block_type() {
		register_block_type(
			self::BLOCK_NAME,
			array(
				'attributes' => array(
					'mapId' => array(
						'type' => 'string',
						'default' => '',
					),
					'mapWidth' => array(
						'type' => 'string',
						'default' => Toolset_Addon_Maps_Common::$map_defaults['map_width'],
					),
					'mapHeight' => array(
						'type' => 'string',
						'default' => Toolset_Addon_Maps_Common::$map_defaults['map_height'],
					),
					'mapZoomAutomatic' => array(
						'type' => 'boolean',
						'default' => true,
					),
					'mapZoomLevelForMultipleMarkers' => array(
						'type' => 'integer',
						'default' => Toolset_Addon_Maps_Common::$map_defaults['general_zoom'],
					),
					'mapZoomLevelForSingleMarker' => array(
						'type' => 'integer',
						'default' => Toolset_Addon_Maps_Common::$map_defaults['single_zoom'],
					),
					'mapCenterLat' => array(
						'type' => 'float',
						'default' => Toolset_Addon_Maps_Common::$map_defaults['general_center_lat'],
					),
					'mapCenterLon' => array(
						'type' => 'float',
						'default' => Toolset_Addon_Maps_Common::$map_defaults['general_center_lon'],
					),
					'mapForceCenterSettingForSingleMarker' => array(
						'type' => 'boolean',
						'default' => false,
					),
					'mapMarkerClustering' => array(
						'type' => 'boolean',
						'default' => false,
					),
					'mapMarkerClusteringMinimalNumber' => array(
						'type' => 'integer',
						'default' => Toolset_Addon_Maps_Common::$map_defaults['cluster_min_size'],
					),
					'mapMarkerClusteringMinimalDistance' => array(
						'type' => 'integer',
						'default' => Toolset_Addon_Maps_Common::$map_defaults['cluster_grid_size'],
					),
					'mapMarkerClusteringMaximalZoomLevel' => array(
						'type' => 'integer',
						'default' => 14,
					),
					'mapMarkerClusteringClickZoom' => array(
						'type' => 'boolean',
						'default' => true,
					),
					'mapMarkerSpiderfying' => array(
						'type' => 'boolean',
						'default' => false,
					),
					'mapDraggable' => array(
						'type' => 'boolean',
						'default' => true,
					),
					'mapScrollable' => array(
						'type' => 'boolean',
						'default' => true,
					),
					'mapDoubleClickZoom' => array(
						'type' => 'boolean',
						'default' => true,
					),
					'mapType' => array(
						'type' => 'string',
						'default' => Toolset_Addon_Maps_Common::$map_defaults['map_type'],
					),
					'mapTypeControl' => array(
						'type' => 'boolean',
						'default' => true,
					),
					'mapZoomControls' => array(
						'type' => 'boolean',
						'default' => true,
					),
					'mapStreetViewControl' => array(
						'type' => 'boolean',
						'default' => true,
					),
					'mapBackgroundColor' => array(
						'type' => 'string',
						'default' => '',
					),
					'mapStyle' => array(
						'type' => 'string',
						'default' => Toolset_Addon_Maps_Common::$map_defaults['style_json'],
					),
					'mapLoadingText' => array(
						'type' => 'string',
						'default' => '',
					),
					'mapMarkerIcon' => array(
						'type' => 'string',
						'default' => Toolset_Addon_Maps_Common::$map_defaults['marker_icon'],
					),
					'mapMarkerIconUseDifferentForHover' => array(
						'type' => 'boolean',
						'default' => false,
					),
					'mapMarkerIconHover' => array(
						'type' => 'string',
						'default' => Toolset_Addon_Maps_Common::$map_defaults['marker_icon_hover'],
					),
					'mapStreetView' => array(
						'type' => 'boolean',
						'default' => false,
					),
					// There is array type, but then Gutenberg goes crazy validating. Instead, we have to serialize
					// arrays ourselves, and everything needs to be of type string...
					'markerId' => array(
						'type' => 'string',
						'default' => wp_json_encode( array( '' ) ),
					),
					'markerAddress' => array(
						'type' => 'string',
						'default' => wp_json_encode( array( '' ) ),
					),
					'markerSource' => array(
						'type' => 'string',
						'default' => wp_json_encode( array( 'address' ) ),
					),
					'currentVisitorLocationRenderTime' => array(
						'type' => 'string',
						'default' => wp_json_encode( array( 'immediate' ) ),
					),
					'markerLat' => array(
						'type' => 'string',
						'default' => wp_json_encode( array( '' ) ),
					),
					'markerLon' => array(
						'type' => 'string',
						'default' => wp_json_encode( array( '' ) ),
					),
					'markerTitle' => array(
						'type' => 'string',
						'default' => wp_json_encode( array( '' ) ),
					),
					'popupContent' => array(
						'type' => 'string',
						'default' => wp_json_encode( array( '' ) ),
					),
					'markerUseMapIcon' => array(
						'type' => 'string',
						'default' => wp_json_encode( array( true ) ),
					),
					'markerIcon' => array(
						'type' => 'string',
						'default' => wp_json_encode( array( '' ) ),
					),
					'markerIconUseDifferentForHover' => array(
						'type' => 'string',
						'default' => wp_json_encode( array( false ) ),
					),
					'markerIconHover' => array(
						'type' => 'string',
						'default' => wp_json_encode( array( '' ) ),
					),
					'markerDynamicAddress' => array(
						'type' => 'string',
						'default' => wp_json_encode( array( new \stdClass() ) ),
					),
				),
				'editor_script' => 'toolset-map-block-js',
				'editor_style' => 'toolset-map-block-editor-css',
				'render_callback' => array( $this, 'render' ),
			)
		);
	}

	/**
	 * @param boolean $cluster
	 * @param boolean $spiderfy
	 */
	private function maybe_enqueue_map_rendering_scripts( $cluster, $spiderfy ) {
		if ( ! wp_script_is( 'views-addon-maps-script' ) ) {
			wp_enqueue_script( 'views-addon-maps-script' );
			Toolset_Addon_Maps_Common::maybe_enqueue_azure_css();
		}

		if ( $cluster ) {
			$this->enqueue_marker_clusterer_script = true;
			if ( ! wp_script_is( 'marker-clusterer-script' ) ) {
				wp_enqueue_script( 'marker-clusterer-script' );
			}
		}

		if ( $spiderfy ) {
			if ( ! wp_script_is( 'overlapping-marker-spiderfier' ) ) {
				wp_enqueue_script( 'overlapping-marker-spiderfier' );
			}
		}
	}

	/**
	 * In a View with content template containing a map, the same map id repeats multiple times. This makes ids unique.
	 *
	 * @since 1.7.3
	 *
	 * @param string $map_id
	 *
	 * @return string Unique map id, if the same one repeats on this page.
	 */
	private function get_unique_map_id( $map_id ) {
		$used_map_ids = Toolset_Addon_Maps_Common::$used_map_ids;
		$map_id_corrected = $map_id;
		$loop_counter = 0;
		while ( in_array( $map_id_corrected, $used_map_ids, true ) ) {
			$loop_counter++;
			$map_id_corrected = $map_id . '-' . $loop_counter;
		}

		if ( $map_id_corrected !== $map_id ) {
			$this->keep_corrected_map_id( $map_id, $map_id_corrected );
		}

		return $map_id_corrected;
	}

	/**
	 * When a map id is corrected (unique), keep association with old id, so it can be picked up by markers.
	 *
	 * This is kept for compatibility with maps & markers inserted through shortcodes.
	 *
	 * @since 1.7.3
	 *
	 * @param string $map_id
	 * @param string $map_id_corrected
	 */
	private function keep_corrected_map_id( $map_id, $map_id_corrected ) {
		Toolset_Addon_Maps_Views::$corrected_map_ids[ $map_id ] = $map_id_corrected;
	}

	/**
	 * Renders map & marker attributes to HTML, loads maps rendering JS if needed.
	 *
	 * @param array $attributes Contains attributes + added shortcodes which are the only thing used.
	 * @param string $content Previous version of rendered HTML. Unused.
	 *
	 * @return string
	 */
	public function render( array $attributes, $content ) {
		$this->maybe_enqueue_map_rendering_scripts(
			$attributes['mapMarkerClustering'],
			$attributes['mapMarkerSpiderfying']
		);
		$map_id = $this->get_unique_map_id( $attributes['mapId'] );

		$output = Toolset_Addon_Maps_Common::render_map(
			$map_id,
			array(
				'map_width'            => $attributes['mapWidth'],
				'map_height'           => $attributes['mapHeight'],
				'general_zoom'         => $attributes['mapZoomLevelForMultipleMarkers'],
				'general_center_lat'   => $attributes['mapCenterLat'],
				'general_center_lon'   => $attributes['mapCenterLon'],
				'fitbounds'            => $attributes['mapZoomAutomatic'] ? 'on' : 'off',
				'single_zoom'          => $attributes['mapZoomLevelForSingleMarker'],
				'single_center'        => $attributes['mapForceCenterSettingForSingleMarker'] ? 'off' : 'on',
				'map_type'             => $attributes['mapType'],
				'show_layer_interests' => Toolset_Addon_Maps_Common::$map_defaults['show_layer_interests'],
				'marker_icon'          => $attributes['mapMarkerIcon'],
				'marker_icon_hover'    => $attributes['mapMarkerIconHover'],
				'draggable'            => $attributes['mapDraggable'] ? 'on' : 'off',
				'scrollwheel'          => $attributes['mapScrollable'] ? 'on' : 'off',
				'double_click_zoom'    => $attributes['mapDoubleClickZoom'] ? 'on' : 'off',
				'map_type_control'     => $attributes['mapTypeControl'] ? 'on' : 'off',
				'full_screen_control'  => Toolset_Addon_Maps_Common::$map_defaults['full_screen_control'],
				'zoom_control'         => $attributes['mapZoomControls'] ? 'on' : 'off',
				'street_view_control'  => $attributes['mapStreetViewControl'] ? 'on' : 'off',
				'background_color'     => $attributes['mapBackgroundColor'],
				'cluster'              => $attributes['mapMarkerClustering'] ? 'on' : 'off',
				'cluster_grid_size'    => $attributes['mapMarkerClusteringMinimalDistance'],
				'cluster_max_zoom'     => $attributes['mapMarkerClusteringMaximalZoomLevel'],
				'cluster_click_zoom'   => $attributes['mapMarkerClusteringClickZoom'],
				'cluster_min_size'     => $attributes['mapMarkerClusteringMinimalNumber'],
				'style_json'           => $attributes['mapStyle'],
				'spiderfy'             => $attributes['mapMarkerSpiderfying'] ? 'on' : 'off',
				'street_view'          => $attributes['mapStreetView'] ? 'on' : 'off',
				'marker_id'            => Toolset_Addon_Maps_Common::$map_defaults['marker_id'],
				'location'             => $attributes['mapStreetView'] ?
					'first' :
					Toolset_Addon_Maps_Common::$map_defaults['location'],
				'address'              => Toolset_Addon_Maps_Common::$map_defaults['address'],
				'heading'              => Toolset_Addon_Maps_Common::$map_defaults['heading'],
				'pitch'                => Toolset_Addon_Maps_Common::$map_defaults['pitch'],
			),
			$attributes['mapLoadingText']
		);

		foreach( $this->get_marker_attribute_array( $attributes ) as $marker ) {
			if ( $marker[ 'markerSource' ] === 'address' ) {
				$output .= $this->render_marker_from_address( $map_id, $marker, $marker['markerAddress'] );
			} elseif ( $marker[ 'markerSource' ] === 'browser_geolocation' ) {
				// Special case when we need to get coordinates from browser - collect_map_data method will recognize
				// and process it.
				$output .= $this->render_marker(
					$map_id,
					$marker,
					'geo',
					$marker['currentVisitorLocationRenderTime']
				);
			} elseif ( $marker['markerSource'] === 'dynamic') {
				if ( ! did_action( 'toolset/dynamic_sources/actions/register_sources' ) ) {
					do_action( 'toolset/dynamic_sources/actions/register_sources' );
				}
				$address = apply_filters(
					'toolset/dynamic_sources/filters/get_source_content',
					'',
					$marker['markerDynamicAddress']->provider,
					get_the_ID(),
					$marker['markerDynamicAddress']->source,
					$marker['markerDynamicAddress']->field
				);

				// Multiple field instances
				if ( is_array( $address ) ) {
					foreach ( $address as $single_address ) {
						$output .= $this->render_marker_from_address( $map_id, $marker, $single_address );
					}
				} else { // Single address
					$output .= $this->render_marker_from_address( $map_id, $marker, $address );
				}
			} else { // When lat/lng given as numbers
				$output .= $this->render_marker( $map_id, $marker );
			}
		}

		return $output;
	}

	/**
	 * @param string $map_id
	 * @param array $marker
	 * @param null|string|float $lat
	 * @param null|string|float $lon
	 *
	 * @return string
	 */
	private function render_marker( $map_id, array $marker, $lat = null, $lon = null ) {
		return Toolset_Addon_Maps_Common::render_marker(
			$map_id,
			array(
				'id'			=> $marker['markerId'],
				'title'			=> $marker['markerTitle'],
				'lat'			=> $lat ?: $marker['markerLat'],
				'lon'			=> $lon ?: $marker['markerLon'],
				'icon'			=> $marker['markerIcon'],
				'icon_hover'	=> $marker['markerIconHover'],
			),
			$marker['popupContent']
		);
	}

	/**
	 * @param string $map_id
	 * @param array $marker
	 * @param string $address
	 *
	 * @return string
	 */
	private function render_marker_from_address( $map_id, array $marker, $address ) {
		$address_data = Toolset_Addon_Maps_Common::get_coordinates( $address );
		if ( is_array( $address_data ) ) {
			return $this->render_marker( $map_id, $marker, $address_data['lat'], $address_data['lon'] );
		}
		return '';
	}

	/**
	 * JSON decodes and flattens marker attributes to a nice array
	 *
	 * @param array $attributes
	 *
	 * @return array
	 */
	private function get_marker_attribute_array( array $attributes ) {
		$marker_attributes = array(
			'markerId', 'markerAddress', 'markerSource', 'currentVisitorLocationRenderTime', 'markerLat', 'markerLon',
			'markerTitle', 'popupContent', 'markerUseMapIcon', 'markerIcon', 'markerIconUseDifferentForHover',
			'markerIconHover', 'markerDynamicAddress'
		);

		$markers_decoded = array();
		foreach ( $marker_attributes as $attribute ) {
			$markers_decoded[ $attribute ] = json_decode( $attributes[ $attribute ] );
		}

		$markers = array();
		foreach ( $markers_decoded as $attribute => $values ) {
			foreach ( $values as $key => $value ) {
				$markers[ $key ][ $attribute ] = $value;
			}
		}

		return $markers;
	}

	/**
	 * @param string $option
	 *
	 * @return mixed
	 */
	private function get_saved_option( $option ) {
		$saved_options = apply_filters( 'toolset_filter_toolset_maps_get_options', array() );

		return $saved_options[$option];
	}

	/**
	 * @return int
	 */
	private function get_map_counter() {
		return $this->get_saved_option( 'map_counter' );
	}

	/**
	 * @return int
	 */
	private function get_marker_counter() {
		return $this->get_saved_option( 'marker_counter' );
	}

	/**
	 * Multi-API aware check for API keys.
	 * @return bool
	 */
	private function is_the_right_api_key_entered() {
		$api_used = apply_filters( 'toolset_maps_get_api_used', '' );

		if ( Toolset_Addon_Maps_Common::API_GOOGLE === $api_used ) {
			$key = apply_filters( 'toolset_filter_toolset_maps_get_api_key', '' );
		} else {
			$key = apply_filters( 'toolset_filter_toolset_maps_get_azure_api_key', '' );
		}
		return !empty( $key );
	}

	/**
	 * Under assumption that site settings are not wrong, answers if frontend is served over https
	 *
	 * @return bool
	 */
	private function is_frontend_served_over_https(){
		return ( wp_parse_url( get_home_url(), PHP_URL_SCHEME ) === 'https' );
	}
}
