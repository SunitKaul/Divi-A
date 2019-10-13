# Padding/Margin control

Allows blocks to set padding and margin rules to its elements

![How it works](./_doc/img/control.png)

## How it works

- The control shows a table simulating a browser console padding/margin control
- 8 inputs for each style propery:

| | | Inputs | | |
| - | - | ----- | - | - |
| | | marginTop | | |
| | | paddingTop | | |
| marginLeft | paddingLeft | | paddingRight | marginRight |
| | | paddingBottom | | |
| | | marginBottom | | |

- Data returned is an object compilant with React:
```javascript
{
	marginTop: '10px',
	marginRight: '10px',
	marginBottom: '10px',
	marginLeft: '10px',
}

{
	paddingTop: '10px',
	paddingRight: '10px',
	paddingBottom: '10px',
	paddingLeft: '10px',
}
```

## How to use it

```html
<PaddingMarginControl
	label={ __( 'Margin and Padding', 'wpv-views' ) }
	isInitiallyOpen={ false }
	margin={ margin }
	padding={ padding }
	onChangeMargin={ selectedMargin => setAttributes( { margin: selectedMargin } ) }
	onChangePadding={ selectedPadding => setAttributes( { padding: selectedPadding } ) }
/>
```

### Properties

- **label**: Label displayed
- **margin**: CSS margin object rule:
```javascript
{
	marginTop,
	marginRight,
	marginBottom,
	marginLeft,
}
```
- **padding**: CSS padding object rule:
```javascript
{
	paddingTop,
	paddingRight,
	paddingBottom,
	paddingLeft,
}
```
- **onChangeMargin**: callback called when `margin` changes
- **onChangePadding**: callback called when `padding` changes
- **isInitiallyOpen**: boolean, default `false`

## Important notes

You can add the object directly as a CSS rule using the `style` attribute:

```html
<div
	style={ {
		display: 'inline-block',
		... padding,
		... margin
	} }
/>
```
