<?php

/**
 * Class Access_Ajax_Handler_Update_Settings
 *
 * @since 2.8
 */
class Access_Ajax_Handler_Update_Settings extends Toolset_Ajax_Handler_Abstract {

	/**
	 * Access_Ajax_Handler_Update_Settings constructor.
	 *
	 * @param \OTGS\Toolset\Access\Ajax $access_ajax
	 */
	public function __construct( \OTGS\Toolset\Access\Ajax $access_ajax ) {
		parent::__construct( $access_ajax );
	}

	/**
	 * @param array $arguments
	 */
	public function process_call( $arguments ) {
		$this->ajax_begin( array( 'nonce' => 'wpcf-access-edit' ) );
		$status = ( isset( $_POST['status'] ) ? sanitize_text_field( wp_unslash( $_POST['status'] ) ) : 'true' );
		$status = ( 'true' === $status ? true : false );
		update_option( 'toolset-access-is-roles-protected', $status );
		$this->ajax_finish( '', true );
		wp_send_json_success();
	}


}
