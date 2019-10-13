# ShortcodeRender

Simple Helper to render **any** shortcode.

Usage
```
import ShortcodeRender from '../../utils/shortcode-render';

ShortcodeRender.render( shortcode ).then( ( shortcodeHTML ) => {
  console.log( shortcodeHTML );
} );
```
**Let's say you have a Types field "my-field" with the value "Hello".**
* In this case `shortcode` would be: `[types field='my-field']` 
* And the response `shortcodeHTML` would be `Hello`.

If the **exact** same shortcode (including all attributes) is used again, 
there won't be a second server request. But caching can be skipped by adding `true` as second parameter:
```
ShortcodeRender.render( shortcode, true ).then( ( shortcodeHTML ) => {
  // forced to call the server, even if the same shortcode was rendered before
  console.log( shortcodeHTML );
} );
```
