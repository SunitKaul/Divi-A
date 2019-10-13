# Container

The Container Control offers a set of controls.

### Attribute

*attributes.js*
```
container: {
    type: 'object',
},
```
**That's all, if you want all controls of the container.**

### Usage

*edit.js*
```
import { ContainerEdit } from '../../control/container';

<ContainerEdit setAttributes={ this.props.setAttributes } data={ this.props.attributes.container }>
    ... ALL EDIT CONTENT OF THE BLOCK ...
</ContainerEdit>
```


If you want to disable an control of the container, for example Background Color:
```
<ContainerEdit 
    setAttributes={ this.props.setAttributes } 
    data={ this.props.attributes.container }
    disable={ [ 'backgroundColor' ] }
>
    ... ALL EDIT CONTENT OF THE BLOCK ...
</ContainerEdit>
```

*save.js*
```
import { ContainerSave } from '../../control/container';

<ContainerSave data={ this.props.attributes.container }>
   ... ALL SAVE CONTENT OF THE BLOCK ...
</ContainerSave>
```

**That's it. Everything else is handled by the Container itself.**

