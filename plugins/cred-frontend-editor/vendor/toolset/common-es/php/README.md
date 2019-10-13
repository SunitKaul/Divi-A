# Auryn is temporary included
Auryn can be deleted (the complete dir php/Library/Auryn) once Toolset Blocks is shipped with Views. When that happens also
adjust the `toolset_common_es_dic` filter on `php/bootstrap.php` to this:
```
add_filter( 'toolset_common_es_dic', function( $default ) {
	$dic_common = apply_filters( 'toolset_dic', false );
	
	if( $dic_common ) {
		$dic_common->share( '\ToolsetCommonEs\Utils\ScriptData' );
	}

	return $dic_common;
}
```
