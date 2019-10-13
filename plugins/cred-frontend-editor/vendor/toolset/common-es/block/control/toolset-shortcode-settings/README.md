# Toolset Shortcode Settings

This components allows to configure Toolset Shortcodes attributes

## How to use it

```javascript
import { ToolsetShortcodeSettings } from '../../control/toolset-shortcode-settings';

<ToolsetShortcodeSettings
	fieldType={ toolsetField }
	onChange={ value => console.log( value ) }
	options={ options }
	onChangeMode={ null | "moddedAttributeOnly" }
/>
```

### Properties

- **onChange**: callback called when a settings changes, it returns an object with of all settings
- **onChangeMode**: Optional. This changes what is passed to the onChange callback function, see example with date settings:
	- **Default (not set)**: all options are passed on any change:
	```
	{
	format: "toolsetCombo",
	output: "normal",
	style: "text,
	"toolsetCombo:format": "Custom Y.m.D",
	}
	```
	- **moddedAttributeOnly**: only the changed option is passed:
		- change style to "calendar" would pass `{ style: "calendar" }`
		- In addition this will also resolve `toolsetCombo` to one key&value pair. For example if format "Custom" is used, the passed value is `{ format: "Custom Y.m.D" }` *and not `{ format: "toolsetCombo", "toolsetCombo:format": "Y.m.D" }`.*
- **options**: saved options
- **fieltType**: `{object}` An object retrieved from `toolsetBlocksStrings`, for example:
```javascript
toolsetBlocksStrings.dynamicSources.__current_post[ 5 ].options[ 0 ].fields
```
returns
```json
{
	"label": "My checkboxes",
	"value": "my-checkboxes",
	"type": "checkboxes",
	"fieldOptions": {
		"wpcf-fields-checkboxes-option-d30a43ba824bfad0a2381eec618528a9-1": {
			"title": "Checkbox title 1",
			"set_value": "1",
			"display": "db",
			"display_value_not_selected": "",
			"display_value_selected": ""
		},
		"wpcf-fields-checkboxes-option-fd6c198e4946afadad169d116fd3c50d-1": {
			"title": "Checkbox title 2",
			"set_value": "2",
			"display": "db",
			"display_value_not_selected": "",
			"display_value_selected": ""
		},
		"wpcf-fields-checkboxes-option-e7a4df11b2132f75eb638ffcedeb117f-1": {
			"title": "Checkbox title 3",
			"set_value": "3",
			"display": "db",
			"display_value_not_selected": "",
			"display_value_selected": ""
		}
	}
}
```

## Important notes

- It uses Types Shortcode library:
  - Javascript variable: `types_shortcode_i18n`
  - Toolset filters: `toolset-filter-shortcode-gui-computed-attribute-values` and `toolset-filter-shortcode-gui-crafted-shortcode`

# Toolset Shortcode Generator

Returns a string with the generated Types shortcode

## How to use it

```javascript
import { ToolsetShortcodeSettings, generateToolsetShortcode } from '../../control/toolset-shortcode-settings';

const shortcode = generateToolsetShortcode( fieldType, fieldSlug, attributeList, fieldOptions );
```

### Parameters

- **fieldType**: `{string}` Field type: `radio`, `numeric`, `checkboxes`...
- **fieldSlug**: `{string}` Field slug: `my-radio`, `my-numeric`, `my-checkboxes`...
- **attributeList**: `{object}` A list of objects returned by `ToolsetShortcodeSettings::onChange()`
- **fieldOptions**: `{object}` A list of objects stored in `toolsetBlocksStrings.dynamicSources`. It belongs to fields like `radio`, `checkboxes` or `select`. An example:
```json
{
	"wpcf-fields-checkboxes-option-d30a43ba824bfad0a2381eec618528a9-1": {
		"title": "Checkbox title 1",
		"set_value": "1",
		"display": "db",
		"display_value_not_selected": "",
		"display_value_selected": ""
	},
	"wpcf-fields-checkboxes-option-fd6c198e4946afadad169d116fd3c50d-1": {
		"title": "Checkbox title 2",
		"set_value": "2",
		"display": "db",
		"display_value_not_selected": "",
		"display_value_selected": ""
	},
	"wpcf-fields-checkboxes-option-e7a4df11b2132f75eb638ffcedeb117f-1": {
		"title": "Checkbox title 3",
		"set_value": "3",
		"display": "db",
		"display_value_not_selected": "",
		"display_value_selected": ""
	}
}
```

## Extending the object

Some blocks may need to use this control to render an element settings. Best way to do it is extending `ToolsetShortcodeSettings`.

There are 2 important methods you need to know: `getFields` and `isSettingVisible`

```javascript
class ShortcodeSettings extends ToolsetShortcodeSettings {
	/**
	 * Gets the list of settings from an object. In this case `viewsInfo` is used in Views Editor block
	 */
	getFields() {
		return viewsInfo.shortcode_settings[ myShortcode ].attributes;
	}

	/**
	 * Checks if current setting is visible
	 *
	 * @param {string} key The key of the current setting
	 * @param {string} options The options of the current setting
	 * @param {string} globalSettings If the condition depends on some other setting
	 * @returns {boolean}
	 */
	isSettingVisible( key, options, globalSettings ) {
		// Some checking
		return true;
	}
}
```

## Important notes

### Grouped options

Some settings have options that depend on a different element stored in `grouped_options`. Instead of loading them using Ajax, it loads all of them grouped by type. Then, using `options_filter`, that points to the component `props`, we want to get proper list of options.

An example can be found in Views:
- `frontend\view-editor\blocks\custom_search\filter\edit.js`
- `embedded\inc\filters\wpv-filter-meta-field-embedded.php`
