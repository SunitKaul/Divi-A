<?php

namespace ToolsetCommonEs\Composer;

use Composer\Installer\PackageEvent;

/**
 * Class Common
 * @package ToolsetCommonEs\Composer
 *
 * @since 1.0.0
 */
class Common {
	const PACKAGE_NAME = 'toolset/common-es';

	/**
	 * Run NPM command
	 *
	 * @param $command
	 */
	public static function runNpmCommand( $command ) {
		$ds_path = 'vendor/' . self::PACKAGE_NAME;
		exec( "cd $ds_path && npm $command" );
	}
}
