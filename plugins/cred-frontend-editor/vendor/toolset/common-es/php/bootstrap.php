<?php
/**
 * Toolset Common ES - Bootstrap
 *
 * This is the root of the dependencies tree. If you need to inject dependencies from other plugins apply a filter
 * only here on the bootstrap.php and use a dependency injection method on the target class to avoid
 * hiding dependencies.
 */

/**
 * Once TB is merged to Views /php/Auryn can be deleted and this function should be removed.
 * @return \ToolsetCommonEs\Library\Auryn\Injector
 */
function toolset_common_es_dic() {
	static $dic;

	if ( null === $dic ) {
		$dic = new \ToolsetCommonEs\Library\Auryn\Injector();
	}

	return $dic;
}

/**
 * This extends toolset_dic for some shares.
 *
 * Currently it also has a fallback for the case TB runs without Toolset Common available.
 * Once TB is merged to Views the use of "toolset_common_es_dic" should be removed from this.
 */
add_filter( 'toolset_common_es_dic', function( /** @noinspection PhpUnusedParameterInspection */ $default ) {
	$dic_common = apply_filters( 'toolset_dic', false );

	// Only delete this line, when TB is merged to Views.
	$dic_common = $dic_common ?: toolset_common_es_dic();

	// Shares
	$dic_common->share( '\ToolsetCommonEs\Utils\ScriptData' );
	$dic_common->share( '\ToolsetCommonEs\Rest\API' );

	return $dic_common;
} );

add_action( 'init', function() {
	$dic = apply_filters( 'toolset_common_es_dic', false );

	if( ! $dic ) {
		return;
	}

	// Blocks Style
	/** @var \ToolsetCommonEs\Block\Style\Block\Factory $block_styles_factory */
	$block_styles_factory = $dic->make( '\ToolsetCommonEs\Block\Style\Block\Factory' );
	$block_factories = apply_filters( 'toolset_common_es_block_factories', array() );

	try {
		foreach( $block_factories as $block_factory ) {
			$block_styles_factory->add_block_factory( $block_factory );
		}
	} catch( \Exception $e ) {
		// This probably means someone injected invalid data on 'toolset_common_es_block_factories' filter.
		// error_log( $e->getMessage() );
	}

	$dic->define( '\ToolsetCommonEs\Block\Style\Loader', array( ':block_factory' => $block_styles_factory ) );
	$dic->make( '\ToolsetCommonEs\Block\Style\Loader' );
}, 2 );

/* Admin Init */
add_filter( 'admin_init', function() {
	$dic = apply_filters( 'toolset_common_es_dic', false );

	if( ! $dic ) {
		return;
	}

	/** @var \ToolsetCommonEs\Utils\ScriptData $script_data */
	$script_data = $dic->make( '\ToolsetCommonEs\Utils\ScriptData' );
	$script_data->add_data( 'settings', get_option( 'toolset_blocks_settings', array() ) );
} );

/* Rest API */
add_action( 'rest_api_init', function() {
	// Backend (is_admin() does not work on rest requests itself, so we also need to load on any rest request)
	if( is_admin() || ( defined( 'REST_REQUEST') && REST_REQUEST ) ) {
		$dic = apply_filters( 'toolset_common_es_dic', false );

		if( ! $dic ) {
			return;
		}

		// Rest API
		$rest_api = $dic->make( '\ToolsetCommonEs\Rest\API' );

		// - Add Settings
		$rest_api->add_route( $dic->make( '\ToolsetCommonEs\Rest\Route\Settings' ) );

		// - Shortcode Render
		$rest_api->add_route( $dic->make( '\ToolsetCommonEs\Rest\Route\ShortcodeRender' ) );

		// -> Init routes
		$rest_api->rest_api_init();
	}
}, 2 );

/* Script Data (only needed for admin)*/
add_action( 'admin_print_scripts', function() {
	$dic = apply_filters( 'toolset_common_es_dic', false );

	if( ! $dic ) {
		return;
	}

	// Print Script Data
	$script_data = $dic->make( '\ToolsetCommonEs\Utils\ScriptData' );
	$script_data->admin_print_scripts();
}, 1 );

