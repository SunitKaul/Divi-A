<?php
// @codingStandardsIgnoreStart
/**
 * Meta Fields.
 *
 * @package CartFlows
 */

/**
 * Class Cartflows_PRO_Meta_Fields.
 */
class Cartflows_PRO_Meta_Fields {

	/**
	 * Instance
	 *
	 * @var $instance
	 */
	private static $instance;

	/**
	 * Initiator
	 */
	public static function get_instance() {
		if ( ! isset( self::$instance ) ) {
			self::$instance = new self;
		}

		return self::$instance;
	}

	public function get_optgroup_field( $field_data ) {

		$saved_value 			= $field_data['value'];
		$flow_id 			= $field_data['data-flow-id'];
		$exclude_id 			= $field_data['data-exclude-id'];
		// echo $step_id;
		// $pro_options	= isset( $field_data['pro-options'] ) ? $field_data['pro-options'] : array();

		if(is_array($field_data['optgroup']) && !empty($field_data['optgroup'])){

			$field_content = '<select name="' . $field_data['name'] . '">';
			$cartflows_steps_args = array(
						'posts_per_page'   => -1,
						'orderby'          => 'date',
						'order'            => 'DESC',
						'post_type'        => 'cartflows_step',
						'post_status'      => 'publish',
						'post__not_in'     => array($exclude_id),
						// 'fields'           => 'ids',
					);
			$field_content .= '<option class="wcf_steps_option" value="" ' . selected( $saved_value,"", false ) . ' >Default</option>';
			foreach ( $field_data['optgroup'] as $optgroup_key => $optgroup_value ) {
				$cartflows_steps_args['tax_query'] = array(
										'relation' => 'AND',
										array(
											'taxonomy' => 'cartflows_step_type',
											'field'    => 'slug',
											'terms'    => $optgroup_key,
										),
										array(
											'taxonomy' => 'cartflows_step_flow',
											'field'    => 'slug',
											'terms'    => 'flow-'.$flow_id,
											
										),
									);
				$cartflows_steps_query = new WP_Query( $cartflows_steps_args );
				$cartflows_steps = $cartflows_steps_query->posts;

				if( !empty($cartflows_steps)){
					
					$field_content .= '<optgroup label="'.$optgroup_value.'"></optgroup>' ;
					foreach ( $cartflows_steps as $key => $value ) {
						$field_content .= '<option class="wcf_steps_option" value="' . esc_attr($value->ID) . '" ' . selected( $saved_value, $value->ID, false ) . ' >&emsp;' . esc_attr($value->post_title) . '</option>';
					}
					$field_content .= '</optgroup>' ;
				}
			}
		
		}

		$field_content .= '</select>';
			
		
		return wcf()->meta->get_field( $field_data, $field_content );
	}
}
// @codingStandardsIgnoreEnd
