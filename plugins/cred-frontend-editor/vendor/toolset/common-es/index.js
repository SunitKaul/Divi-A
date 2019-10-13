// General CSS
import './scss/edit.scss';

// Compose library
import * as utils from './utils/index';
import * as control from './block/control/index';
import * as composition from './block/control/composition/index';
import * as wrapper from './block/wrapper/index';

const controlGroup = { control: { ...control, composition: { ...composition } } };
const block = { wrapper, ...controlGroup };

export { utils, block };
