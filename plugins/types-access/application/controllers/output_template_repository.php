<?php

namespace OTGS\Toolset\Access\Controllers;

/**
 * Repository for templates in Access.
 *
 * See Toolset_Renderer for a detailed usage instructions.
 *
 * @since 2.8
 */
class AccessOutputTemplateRepository extends \Toolset_Output_Template_Repository_Abstract {

	const USERS_FILTER_OPTION_TEMPLATE = 'users_filter_option.phtml';
	const ERASE_DATABASE_OPTION_TEMPLATE = 'erase_database.phtml';

	/**
	 * @var array|null Template definition cache.
	 */
	private $templates;


	/** @var Toolset_Output_Template_Repository */
	private static $instance;


	/**
	 * @return Toolset_Output_Template_Repository
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}


	/**
	 * @inheritdoc
	 * @return string
	 */
	protected function get_default_base_path() {
		return $this->constants->constant( 'ACCESS_TEMPLATES' );
	}


	/**
	 * Get the array with template definitions.
	 *
	 * @return array
	 */
	protected function get_templates() {
		if ( null === $this->templates ) {
			$this->templates = array(
				self::USERS_FILTER_OPTION_TEMPLATE => array(
					'base_path'  => ACCESS_TEMPLATES . '/settings',
					'namespaces' => array()
				),
				self::ERASE_DATABASE_OPTION_TEMPLATE => array(
					'base_path'  => ACCESS_TEMPLATES . '/settings',
					'namespaces' => array()
				),
			);
		}

		return $this->templates;
	}

	public function render( $template, $context = array(), $echo = false ) {
		$renderer = \Toolset_Renderer::get_instance();
		$output   = $renderer->render(
			$this->get( $template ),
			$context,
			$echo
		);

		return $output;
	}

}
