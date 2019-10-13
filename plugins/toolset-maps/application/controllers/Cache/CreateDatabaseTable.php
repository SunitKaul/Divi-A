<?php
namespace OTGS\Toolset\Maps\Controller\Cache;

/**
 * Creates the address cache database table
 */
class CreateDatabaseTable {
	const TABLE_NAME = 'toolset_maps_address_cache';

	/**
	 * @return string
	 */
	public static function run() {
		global $wpdb;

		$table_name = $wpdb->prefix . self::TABLE_NAME;
		$charset_collate = $wpdb->get_charset_collate();
		$postmeta_collation = self::get_postmeta_collation();

		// Check if we can find wp_postmeta table collation. If we can, and it's not the same as recommended collation
		// that $wpdb->get_charset_collate() gives, better use the same collation as wp_postmeta, because these two
		// tables need to be joined on a varchar, and must have the same collation.
		if (
			$postmeta_collation
			&& $postmeta_collation !== $wpdb->collate
		) {
			$charset_collate = "DEFAULT CHARACTER SET utf8mb4 COLLATE $postmeta_collation";
		}

		$sql = "CREATE TABLE $table_name (
			address_passed varchar(190) NOT NULL, 
			address varchar(255) NOT NULL, 
			point point NOT NULL,
			PRIMARY KEY  (address_passed)
		) $charset_collate;";

		require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
		$result = dbDelta( $sql );

		return implode( PHP_EOL, $result ) . PHP_EOL;
	}

	/**
	 * Checks if cache table actually exists, because dbDelta can not be trusted to create it, nor to report failure.
	 * @since 1.8.1
	 * @return bool
	 */
	public static function cache_table_exists() {
		global $wpdb;

		$table_name = $wpdb->prefix . self::TABLE_NAME;

		$sql = "SHOW TABLES LIKE '$table_name';";

		$result = ! empty( $wpdb->get_results( $sql ) );

		return $result;
	}

	/**
	 * Tries to get the collation for wp_postmeta.meta_value
	 *
	 * @return string
	 */
	private static function get_postmeta_collation() {
		global $wpdb;

		$postmeta_table_name = $wpdb->prefix . 'postmeta';

		$meta_value_info = $wpdb->get_row(
		// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
			"SHOW FULL COLUMNS FROM $postmeta_table_name WHERE `Field` = 'meta_value'",
			OBJECT
		);

		if (
			$meta_value_info &&
			property_exists( $meta_value_info, 'Collation' )
		) {
			// phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
			return $meta_value_info->Collation;
		}

		return '';
	}
}
