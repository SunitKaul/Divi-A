# Tooltip

Very basic Tooltip, which can be displayed at the mouse or at a specific node.


**Usage Example**
```javascript
import { Tooltip } from '../utils';

const MyTooltip = new Tooltip(
    'fields-and-text-no-typing-to-shortcode',
    __( 'Typing to a shortcode is not possible.', 'wpv-views' )
 );

// Display tooltip at mouse and hides the tooltip after 2 seconds.
MyTooltip.showAtMouse();

// Display tooltip at specific node and hides the tooltip after 2 seconds.
MyTooltip.showAtNode( node );
```
# Methods
### constructor( id, content )
#### Params
- {number} **ID**   
If the same ID is passed the first registered Tooltip will be used. (The content of the second registered is ignored.)
- {string} **Content** 

### showAtMouse( event = null, hideAfter = 2000 )
#### Params
- {event} **event**   
 When an event is passed the events mouseposition is used. Otherwise the last click position is used.
- {number|boolean} **hideAfter**   
Will hide the Tooltip after **hideAfter** ms. When false the Tooltip won't be removed automatically.

### showAtNode( node, hideAfter = 2000 )
#### Params
- {Node} **node**   
Will display the tooltip above the given node. 
- {number|boolean} **hideAfter**   
Will hide the Tooltip after **hideAfter** ms. When false the Tooltip won't be removed automatically.
 

 
### hideAfterMs( ms = 2000 )
#### Params
- {number|boolean} **ms** (default: 2000ms)  
Will hide the Tooltip after the given ms. Is only needed if showAtNode() or showAtMouse() was used without the hiding option.

