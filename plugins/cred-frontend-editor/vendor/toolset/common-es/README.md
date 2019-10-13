# Toolset Common ES

Toolset Common for ECMAScript. 

## How To Use

#### If you need a control:
```
import { Rotate } from 'toolset/block/control';
```
👉 [List of all controls.](./block/control/index.js)

#### If you need the Style Controls Composition:
```
import { StyleControls } from 'toolset/block/control/composition';
```
👉 [List of all control compositions.](./block/control/composition/index.js)

#### If you need a wrapper:
```
import { ContainerEdit } from 'toolset/block/wrapper';
```
👉 [List of all wrappers.](./block/wrapper/index.js)

#### If you need a util function:
```
import { getUniqueId, getNumberOr } from 'toolset/utils';
```
👉 [List of all util functions.](./utils/index.js)

### Developing on Toolset Common ES

Once the installation is done for a plugin, the only importance is to raise the version number in the `loader.php`. Same
principle as on Toolset Common.

While developing on this you need to re-run `npm run build` on this project root to get the bundle rebuild.

**Tipp:** When using Toolset Blocks it's also handy to remove the webpack external entry, this way you can use HMR of Toolset
Blocks and don't need to run `npm run build` on every change. Just make sure to re-apply the external once you're
done with developing.

## Installation

This is only required once per plugin.

#### Composer
```
    ...
	
    "repositories": [
      {
        "type": "vcs",
        "url": "ssh://git@git.onthegosystems.com:10022/toolset/toolset-common-es.git"
      },
      ...
    ],

    "require": {
        "toolset/common-es": "dev-develop",
        ...
    },
    
    "scripts": {
      "post-install-cmd": [
        "ToolsetCommonEs\\Composer\\PostInstallCmd::run",
        ...
      ],
      "post-package-update": [
        "ToolsetCommonEs\\Composer\\PostPackageUpdate::run",
        ...
      ]
    }
    
    ...

```

Now when `composer install` runs, it will also call the installation scripts of Toolset Common ES.

#### Webpack config
The script needs to be marked as external script. Otherwise it would be bundled to the users (TB / Views) bundle.

```
module.exports = {
	...
	externals: [
		...
		// Define Toolset Common Es as externals
		function( context, request, callback ) {
			const toolsetMatches = request.match( /^toolset\/(.*)/i );
			if ( toolsetMatches ) {
				return callback( null, 'window.toolsetCommonEs.' + toolsetMatches[ 1 ].replace( /\//g, '.' ) );
			}
			callback();
		},
	],
```
#### Load Toolset Common ES
In the plugins root file
```
/* Bootstrap Toolset Common ES */
require __DIR__ . '/vendor/toolset/common-es/loader.php';
```

#### Add script / style as dependencies.
Toolset Common ES registers one script `toolset-common-es` and one style `toolset-common-es`. These need to be applied
as dependency:

```
wp_enqueue_script(
	'my-fancy-script'
	'path/to/my/fancy/script.js',
	array(
		'toolset-common-es'
	),
	'1.0.0'
);

wp_enqueue_style(
	'my-fancy-style'
	'path/to/my/fancy/style.css',
	array(
		'toolset-common-es'
	),
	'1.0.0'
);
```

##### CI ignore list
For artifacts put these to the ignore list:

```
      "vendor/toolset/common-es/block",
      "vendor/toolset/common-es/utils",
      "vendor/toolset/common-es/test",
      "vendor/toolset/common-es/scss",
      "vendor/toolset/common-es/php/Composer",
      "vendor/toolset/common-es/node_modules",
      "vendor/toolset/common-es/*.json",
      "vendor/toolset/common-es/*.lock",
      "vendor/toolset/common-es/index.js",
      "vendor/toolset/common-es/README.md",
      "vendor/toolset/common-es/style.js",
      "vendor/toolset/common-es/webpack.*",
      "vendor/toolset/common-es/babel.config.js",
```

#### OPTIONAL: Add Node Package 
For developing it's comfortable to have Toolset Common ES also loaded as node module. This way the IDE recognise it and
provides auto-complete package paths when using import.

```
"devDependencies": {
    "toolset": "git+ssh://git@git.onthegosystems.com:10022/toolset/toolset-common-es.git#develop",
    ...
}
```
