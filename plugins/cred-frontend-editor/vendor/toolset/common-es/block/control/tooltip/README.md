# Tooltip

Integrates [Tippy.js](https://atomiks.github.io/tippyjs/) through the [Official Tippy.js React Component](https://github.com/atomiks/tippy.js-react). 

### Usage

Displays a tooltip over the enclosed element.

```jsx
<Tooltip content="Hello world!!!">
	<button>My button</button>
</Tooltip>
```

### Props

The component accepts the following props:

#### content

If this property is added, it's value will be the content of tooltip.

- Type: `String`
- Required: No

#### arrow

If this property is added, it determines if an arrow should be added to the tippy pointing toward the reference element.

- Type: `Boolean`
- Required: No

#### arrowType

If this property is added, it determines the arrow type.

- Type: `String`
- Required: No
- Possible values: `"sharp"`,  `"round"`

#### animation

If this property is added, it determines the type of transition animation.

- Type: `String`
- Required: No
- Possible values: `"shift-away"`,  `"shift-toward"`, `"fade"`,  `"scale"`, `"perspective"`

#### duration

If this property is added, it determines the duration of the CSS transition animation in ms. 
Specifying a number means both the show and hide delays are the same. 
Use `null` in the array to use the default value.

- Type: `Number`,  `[show, hide]`
- Required: No

#### delay

If this property is added, it determines the delay in ms once a trigger event is fired before a tippy shows or hides.
Specifying a number means both the show and hide delays are the same. Use null in the array to use the default value.

- Type: `Number`,  `[show, hide]`
- Required: No

#### trigger

If this property is added, it determines the The events (each separated by a space) which cause a tippy to show.

- Type: `String`
- Required: No
- Possible values:  `"mouseenter"`, `"focus"`,  `"click"`, `"manual"`. Use  `"manual"` to only trigger the tippy programmatically.

**Note**

The list of the offered properties can be further extended. The full list of available options can be found [here](https://atomiks.github.io/tippyjs/all-options/). 
