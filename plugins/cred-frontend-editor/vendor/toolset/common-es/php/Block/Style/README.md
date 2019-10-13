# Block Style

Block Style allow to apply css on the frontend's head instead of inline css.

### How to apply new blocks 
Common Es provides the filter `toolset_common_es_block_factories` to apply block factories. See this example of Toolset Blocks injecting it's blocks.
```php
	// Common ES Blocks Styles - Add Block Factory for blocks of "Toolset Blocks".
	add_filter( 'toolset_common_es_block_factories', function( $block_factories ) use ( $dic ) {
		if( $block_factory = $dic->make( '\ToolsetBlocks\Block\Style\Block\Factory' ) ) {
			$block_factories[] = $block_factory;
		}
		return $block_factories;
	}, 10, 1 );
```


The injected factory must implement `ToolsetCommonEs\Block\Style\Block\IFactory`.

### Load Custom Styles
The styles of the Common ES style composition are loaded automatically. But the style of non-common controls must 
be loaded by the block. For example TB Heading **text-align** setting. It's stored on the blocks attribute `align`. The
implementation of that setting would look like this (on the block class):
```php
	public function load_block_specific_style_attributes( FactoryStyleAttribute $factory ) {
		$config = $this->get_block_config();
		if( isset( $config[ 'align' ] ) ) {
			if( $style = $factory->get_attribute( 'text-align', $config['align' ] ) ) {
				$this->add_style_attribute( $style, self::KEY_STYLES_FOR_HEADING );
			}
		}
	}
```
See `TOOLSET-BLOCKS/server/Block/Style/Block/Heading.php`

### Styles Mapping
Sometimes it's needed to apply styles to specific parts of the block. This can be done on the block class:
```php
	public function get_css( $config = array(), $force_apply = false ) {
		return parent::get_css( $this->css_config(), $force_apply );
	}

	private function css_config() {
		return array(
			parent::CSS_SELECTOR_ROOT => array(
				parent::KEY_STYLES_FOR_COMMON_STYLES => array(
					'background-color', `border`
				)
			),
			'.tb-inner-container' => array(
				parent::KEY_STYLES_FOR_COMMON_STYLES => array(
					'padding',
				)
			),
			// Using a ! sign allows to have multiple selectors for the same styles.
			'h1!h2!h3!h4!h5!h6!p' => array(
				parent::KEY_STYLES_FOR_COMMON_STYLES => array(
					'font-size', 'font-family'
				)
			),
		);
	}
```
This will generate the following css:
```css
.tb-container[data-unique-id] {
  background-color: #fff;
  border: 1px solid #000;
}

.tb-container[data-unique-id] .tb-inner-container {
  background-color: #fff;
  border: 1px solid #000;
}

.tb-container[data-unique-id] h1,
.tb-container[data-unique-id] h2,
.tb-container[data-unique-id] h3,
.tb-container[data-unique-id] h4,
.tb-container[data-unique-id] h5,
.tb-container[data-unique-id] h6,
.tb-container[data-unique-id] p {
  font-size: 12px;
  font-family: Roboto;
}


```
