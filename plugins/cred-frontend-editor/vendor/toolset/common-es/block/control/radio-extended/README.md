# RadioControl

Gutenberg RadioButton extended, it use tooltips using `help` in `options`.

## Development guidelines

### Usage

Render a user interface to select the user type using radio inputs.

```jsx
import { RadioControl } from '@wordpress/components';
import { withState } from '@wordpress/compose';

const MyRadioControl = withState( {
	option: 'a',
} )( ( { option, setState } ) => (
	<RadioControl
		label="User type"
		help="The type of the current user"
		selected={ option }
		options={ [
			{ label: 'Author', value: 'a', help: 'WordPress Author role' },
			{ label: 'Editor', value: 'e', help: 'WordPress Editor role' },
		] }
		onChange={ ( option ) => { setState( { option } ) } }
	/>
) );
```

### Props

The component accepts the following props:

#### label

If this property is added, a label will be generated using label property as the content.

- Type: `String`
- Required: No

#### help

If this property is added, a help text will be generated using help property as the content.

- Type: `String`
- Required: No

#### selected

The value property of the currently selected option.

- Type: `Object`
- Required: No

#### options

An array of objects containing the following properties:
* `label`: (string) The label to be shown to the user.
* `value`: (Object) The internal value compared against select and passed to onChange.
* `help`: (string) Help text displayed using tooltips.

- Type: `Array`
- Required: No

#### onChange

A function that receives the value of the new option that is being selected as input.

- Type: `function`
- Required: Yes

