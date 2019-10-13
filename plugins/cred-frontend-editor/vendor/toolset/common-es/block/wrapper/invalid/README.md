# Invalid Wrapper
Simple control to visually mark invalid parts of block in editor. E.g.: something that's missing required input or has invalid input, and can be rendered in preview, but should not be expected to actually work or look properly in the frontend. 

## Usage
```
<InvalidWrapper
	condition={ isValid }
	label={ __('You need to add the URL for these buttons to work', 'wpv-views' ) }
>
	<PotentiallyInvalidPartRender />
</InvalidWrapper>
``` 
