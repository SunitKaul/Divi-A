# Select

Integrates [react-select](https://react-select.com). 

### Usage

Displays a select control build using `react-select`.

```jsx
<Select
	options={ options }
	value={ value }
	placeholder={ placeholder }
	styles={ styles }
	isClearable={ isClearable }
	id={ id }
	className={ className }
	onChange={ onChange }
/>
```

### Props

The component accepts the following props:

#### options

Array of options that populate the select menu.

- Type: `Array`
- Required: Yes

#### value

The value of the select; reflected by the selected option.

- Type: `Object`
- Required: Yes

#### placeholder

Placeholder for the select value.

- Type: `String`
- Required: No

#### styles

Style modifier methods.

- Type: `Object`
- Required: No

#### isClearable

Is the select value clearable.

- Type: `Boolean`
- Required: No

#### id

The id of the search input.

- Type: `String`
- Required: No

#### className

The name of the CSS class.

- Type: `String`
- Required: No

#### onChange

Handle change events on the select.

- Type: `Function`
- Required: No

**Note**

The list of the offered properties can be further extended. The full list of available options can be found [here](https://react-select.com/props). 
