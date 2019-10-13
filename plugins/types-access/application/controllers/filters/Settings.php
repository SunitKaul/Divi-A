<?php

namespace OTGS\Toolset\Access\Controllers\Filters;

use OTGS\Toolset\Access\Controllers\AccessOutputTemplateRepository;

/**
 * Add a section to Toolset>Settings to manage Access settings
 *
 * Class Settings_Page
 *
 * @package OTGS\Toolset\Access\Controllers\Filters
 */
class SettingsPage {
	/**
	 * Class init
	 */
	public function init() {
		add_action( 'init', array( $this, 'database_erase_init' ), 999 );
		add_action( 'toolset_enqueue_scripts', array( $this, 'toolset_enqueue_scripts' ) );
	}

	/**
	 * Init Access settings erase
	 */
	public function database_erase_init() {
		global $wpcf_access;
		$settings = $wpcf_access->settings;
		if ( ! empty( $settings->types ) || ! empty( $settings->tax ) || ! empty( $settings->third_party ) ) {
			add_filter( 'toolset_filter_toolset_register_settings_section', array(
				$this,
				'register_settings_access_database_erase_section',
			), 201 );
			add_filter( 'toolset_filter_toolset_register_settings_access-database-erase_section', array(
				$this,
				'database_erase_section_content',
			) );
		}
	}

	/**
	 * Register Toolset Settings tab
	 *
	 * @param array $sections
	 *
	 * @return mixed
	 */
	public function register_settings_access_database_erase_section( $sections ) {
		$sections['access-database-erase'] = array(
			'slug'  => 'access-database-erase',
			'title' => __( 'Access', 'wpcf-access' ),
		);

		return $sections;
	}

	/**
	 * Register Toolset Access Settings sections
	 *
	 * @param array $sections
	 *
	 * @return mixed
	 */
	public function database_erase_section_content( $sections ) {

		$sections['access-database-erase-tool'] = array(
			'slug'    => 'access-database-erase-tool',
			'title'   => __( 'Reset Access settings', 'wpcf-access' ),
			'content' => $this->generate_erase_settings_section_content(),
		);
		$sections['access-settings']            = array(
			'slug'    => 'access-settings',
			'title'   => __( 'User settings', 'wpcf-access' ),
			'content' => $this->generate_access_settings_content(),
		);

		return $sections;
	}

	/**
	 * Generate user settings section output
	 *
	 * @return mixed
	 */
	private function generate_access_settings_content() {
		$template_repository = AccessOutputTemplateRepository::get_instance();
		$output              = $template_repository->render( $template_repository::USERS_FILTER_OPTION_TEMPLATE );

		return $output;
	}

	/**
	 * @return string
	 */
	public function generate_erase_settings_section_content() {
		$access_settings         = \OTGS\Toolset\Access\Models\Settings::get_instance();
		$roles                   = $access_settings->wpcf_get_editable_roles();
		$users_count             = count_users();
		$access_roles            = array();
		$access_roles_names      = array();

		$total_users_to_reassign = 0;
		foreach ( $roles as $role => $role_data ) {
			if ( isset( $role_data['capabilities']['wpcf_access_role'] ) ) {
				$access_roles[]       = $role;
				$access_roles_names[] = $role_data['name'];
				if ( isset( $users_count['avail_roles'][ $role ] ) ) {
					$total_users_to_reassign += $users_count['avail_roles'][ $role ];
				}
			}
		}

		$template_repository = AccessOutputTemplateRepository::get_instance();
		$output              = $template_repository->render( $template_repository::ERASE_DATABASE_OPTION_TEMPLATE,
			array(
				'access_roles' => $access_roles,
				'access_roles_names' => $access_roles_names,
				'total_users_to_reassign' => $total_users_to_reassign,
				'roles' => $roles,
			)
		);

		$output .= wp_nonce_field( 'wpcf-access-edit', 'wpcf-access-edit', true, false );

		return $output;
	}

	/**
	 * Enqueue Script on Toolset Settings page
	 *
	 * @param string $current_page
	 */
	public function toolset_enqueue_scripts( $current_page ) {

		switch ( $current_page ) {
			case 'toolset-settings':
				\TAccess_Loader::loadAsset( 'STYLE/wpcf-access-dev', 'wpcf-access' );
				\TAccess_Loader::loadAsset( 'SCRIPT/wpcf-access-settings', 'wpcf-access' );
				break;
		}
	}
}
