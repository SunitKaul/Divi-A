<?php
/**
 * Plugin Name: AffiliateWP - REST API Extended
 * Plugin URI: https://affiliatewp.com/
 * Description: Adds write, edit, and delete endpoints to the AffiliateWP REST API.
 * Author: AffiliateWP, LLC
 * Author URI: https://affiliatewp.com
 * Version: 1.0.4
 * Text Domain: affiliatewp-rest-api-extended
 * Domain Path: languages
 *
 * AffiliateWP is distributed under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * any later version.
 *
 * AffiliateWP is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with AffiliateWP. If not, see <http://www.gnu.org/licenses/>.
 *
 * @package AffiliateWP REST API Extended
 * @category Core
 * @author Drew Jaynes
 * @version 1.0.4
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ){
	exit;
}

if ( ! class_exists( 'AffiliateWP_REST_API_Extended' ) ) {

	/**
	 * Implements write, edit, and delete endpoints for the AffiliateWP REST API.
	 *
	 * @since 1.0.0
	 */
	final class AffiliateWP_REST_API_Extended {

		/**
		 * Holds the instance.
		 *
		 * Ensures that only one instance of AffiliateWP_REST_API_Extended exists in memory at any one
		 * time and it also prevents needing to define globals all over the place.
		 *
		 * TL;DR This is a static property property that holds the singleton instance.
		 *
		 * @access private
		 * @since  1.0.0
		 * @var    AffiliateWP_REST_API_Extended
		 * @static
		 */
		private static $instance;

		/**
		 * The version number.
		 *
		 * @since 1.0.0
		 */
		private $version = '1.0.4';

		/**
		 * Main AffiliateWP_REST_API_Extended instance.
		 *
		 * Insures that only one instance of AffiliateWP_REST_API_Extended exists in memory at any one
		 * time. Also prevents needing to define globals all over the place.
		 *
		 * @access public
		 * @since  1.0.0
		 * @static var array $instance
		 *
		 * @return AffiliateWP_REST_API_Extended The one true AffiliateWP_REST_API_Extended instance.
		 */
		public static function instance() {

			if ( ! isset( self::$instance ) && ! ( self::$instance instanceof AffiliateWP_REST_API_Extended ) ) {

				if ( version_compare( AFFILIATEWP_VERSION, '2.0', '<' ) ) {
					add_action( 'admin_notices', array( 'AffiliateWP_REST_API', 'below_affwp_version_notice' ) );

					return self::$instance;
				}

				self::$instance = new AffiliateWP_REST_API_Extended;
				self::$instance->setup_constants();
				self::$instance->load_textdomain();
				self::$instance->includes();
				self::$instance->init();
				self::$instance->hooks();

			}

			return self::$instance;
		}

		/**
		 * Throws an error on object clone.
		 *
		 * The whole idea of the singleton design pattern is that there is a single
		 * object therefore, we don't want the object to be cloned.
		 *
		 * @access protected
		 * @since  1.0.0
		 */
		public function __clone() {
			// Cloning instances of the class is forbidden
			_doing_it_wrong( __FUNCTION__, __( 'Cheatin&#8217; huh?', 'affiliatewp-rest-api-extended' ), '1.0' );
		}

		/**
		 * Disables un-serializing of the class.
		 *
		 * @access protected
		 * @since  1.0.0
		 */
		public function __wakeup() {
			// Unserializing instances of the class is forbidden
			_doing_it_wrong( __FUNCTION__, __( 'Cheatin&#8217; huh?', 'affiliatewp-rest-api-extended' ), '1.0' );
		}

		/**
		 * Constructor.
		 *
		 * @access private
		 * @since  1.0.0
		 */
		private function __construct() {
			self::$instance = $this;
		}

		/**
		 * Resets the instance of the class.
		 *
		 * @access public
		 * @since  1.0.0
		 * @static
		 */
		public static function reset() {
			self::$instance = null;
		}

		/**
		 * Show a warning to sites running AffiliateWP < 1.9.
		 *
		 * @access public
		 * @since  1.0.0
		 * @static
		 */
		public static function below_affwp_version_notice() {
			echo '<div class="error"><p>' . __( 'AffiliateWP - REST API requires AffiliateWP 2.0 or later.', 'affiliatewp-rest-api-extended' ) . '</p></div>';
		}

		/**
		 * Sets up plugin constants.
		 *
		 * @access private
		 * @since  1.0.0
		 */
		private function setup_constants() {
			// Plugin version
			if ( ! defined( 'AFFWP_REST_VERSION' ) ) {
				define( 'AFFWP_REST_VERSION', $this->version );
			}

			// Plugin Folder Path
			if ( ! defined( 'AFFWP_REST_PLUGIN_DIR' ) ) {
				define( 'AFFWP_REST_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
			}

			// Plugin Folder URL
			if ( ! defined( 'AFFWP_REST_PLUGIN_URL' ) ) {
				define( 'AFFWP_REST_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
			}

			// Plugin Root File
			if ( ! defined( 'AFFWP_REST_PLUGIN_FILE' ) ) {
				define( 'AFFWP_REST_PLUGIN_FILE', __FILE__ );
			}
		}

		/**
		 * Loads the plugin language files.
		 *
		 * @access public
		 * @since  1.0.0
		 */
		public function load_textdomain() {

			// Set filter for plugin's languages directory.
			$lang_dir = dirname( plugin_basename( __FILE__ ) ) . '/languages/';
			$lang_dir = apply_filters( 'affiliatewp_rest_api_languages_directory', $lang_dir );

			// Traditional WordPress plugin locale filter.
			$locale   = apply_filters( 'plugin_locale',  get_locale(), 'affiliatewp-rest-api-extended' );
			$mofile   = sprintf( '%1$s-%2$s.mo', 'affiliatewp-rest-api-extended', $locale );

			// Setup paths to current locale file.
			$mofile_local  = $lang_dir . $mofile;
			$mofile_global = WP_LANG_DIR . '/affiliatewp-rest-api-extended/' . $mofile;

			if ( file_exists( $mofile_global ) ) {
				// Look in global /wp-content/languages/affiliatewp-rest-api-extended/ folder.
				load_textdomain( 'affiliatewp-rest-api-extended', $mofile_global );
			} elseif ( file_exists( $mofile_local ) ) {
				// Look in local /wp-content/plugins/affiliatewp-rest-api-extended/languages/ folder.
				load_textdomain( 'affiliatewp-rest-api-extended', $mofile_local );
			} else {
				// Load the default language files.
				load_plugin_textdomain( 'affiliatewp-rest-api-extended', false, $lang_dir );
			}
		}

		/**
		 * Includes necessary files.
		 *
		 * @access private
		 * @since  1.0.0
		 */
		private function includes() {
			require_once AFFWP_REST_PLUGIN_DIR . 'includes/REST/v1/endpoint-loader.php';

			if ( is_admin() ) {
				require_once AFFWP_REST_PLUGIN_DIR . 'includes/admin/class-settings.php';
			}
		}

		/**
		 * Checks for updates to the add-on on plugin initialization.
		 *
		 * @access private
		 * @since  1.0.1
		 *
		 * @see AffWP_AddOn_Updater
		 */
		private function init() {

			if ( is_admin() && class_exists( 'AffWP_AddOn_Updater' ) ) {
				$updater = new AffWP_AddOn_Updater( 158216, __FILE__, $this->version );
			}
		}

		/**
		 * Sets up the default hooks and actions.
		 *
		 * @since 1.0.0
		 */
		private function hooks() {
			// Plugin meta.
			add_filter( 'plugin_row_meta', array( $this, 'plugin_meta' ), null, 2 );
		}

		/**
		 * Modifies plugin metalinks.
		 *
		 * @access public
		 * @since  1.0.0
		 *
		 * @param array $links The current links array.
		 * @param string $file A specific plugin table entry.
		 * @return array The modified links array.
		 */
		public function plugin_meta( $links, $file ) {
			if ( $file == plugin_basename( __FILE__ ) ) {
				$plugins_link = array(
					'<a title="' . __( 'Get more add-ons for AffiliateWP', 'affiliatewp-rest-api-extended' ) . '" href="http://affiliatewp.com/addons/" target="_blank">' . __( 'More add-ons', 'affiliatewp-rest-api-extended' ) . '</a>'
				);

				$links = array_merge( $links, $plugins_link );
			}

			return $links;
		}
	}

	/**
	 * The main function responsible for returning the one true AffiliateWP_REST_API_Extended
	 * Instance to functions everywhere.
	 *
	 * Use this function like you would a global variable, except without needing
	 * to declare the global.
	 *
	 * Example: <?php $affiliatewp_rest_api_extended = affiliatewp_rest_api_extended(); ?>
	 *
	 * @since 1.0.0
	 *
	 * @return AffiliateWP_REST_API_Extended The one true AffiliateWP_REST_API_Extended instance.
	 */
	function affiliatewp_rest_api_extended() {

		if ( ! class_exists( 'Affiliate_WP' ) ) {

			add_action( 'admin_notices', 'affiliatewp_rest_api_extended_missing_core' );
			function affiliatewp_rest_api_extended_missing_core() {
				echo '<div class="error"><p>' . __( 'Please activate the main AffiliateWP plugin in order to use AffiliateWP - REST API Extended.', 'affiliatewp-rest-api-extended' ) . '</p></div>';
			}

		} else {

			return AffiliateWP_REST_API_Extended::instance();

		}

	}
	add_action( 'plugins_loaded', 'affiliatewp_rest_api_extended', 100 );
}
