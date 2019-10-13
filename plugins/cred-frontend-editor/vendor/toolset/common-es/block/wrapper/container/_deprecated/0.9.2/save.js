// Wordpress dependencies
import { Component, Fragment } from '@wordpress/element';

// Internal dependencies
import { getStyleObjectByAttributes } from '../../../../control/composition';

const NO_CONTAINER_VALUE = 'none';

const DEFAULT_BORDER = {
	style: 'solid',
	width: null,
	widthUnit: 'px',
	color: { hex: '#000000', rgb: { r: 0, g: 0, b: 0, a: 1 } },
};

const defaults = {
	tag: NO_CONTAINER_VALUE,
	inline: null,
	id: '',
	cssClasses: '',
	fontSize: undefined,
	lineHeight: '',
	lineHeightUnit: 'px',
	textColor: null,
	backgroundColor: null,
	margin: {},
	padding: {},
	border: {
		top: DEFAULT_BORDER,
		right: DEFAULT_BORDER,
		bottom: DEFAULT_BORDER,
		left: DEFAULT_BORDER,
	},
	borderRadius: {
		topLeft: undefined,
		topRight: undefined,
		bottomRight: undefined,
		bottomLeft: undefined,
	},
	boxShadow: {
		enabled: false,
		color: { hex: '#000000', rgb: { r: 0, g: 0, b: 0, a: 0.5 } },
		horizontal: 5,
		vertical: 5,
		blur: 10,
		spread: 0,
	},
	rotate: undefined,
	zIndex: undefined,
};

export default class extends Component {
	normaliseString( string ) {
		if ( typeof string !== 'string' || ! string.trim() ) {
			return '';
		}

		return string;
	}

	render() {
		const { children, data, extraClassString } = this.props;
		const container = { ...defaults, ...data };
		let Tag = container.tag !== NO_CONTAINER_VALUE ? container.tag : false;

		const extraClasses = this.normaliseString( extraClassString );

		// if no container, nut extraClassString is used we use div
		Tag = ! Tag && extraClasses !== '' ? 'div' : Tag;

		if ( ! Tag ) {
			// no container selected
			return (
				<Fragment>
					{ children }
				</Fragment>
			);
		}
		return (
			<Tag id={ container.id || null }
				className={ `tb-container${ container.cssClasses ? ' ' + container.cssClasses : '' }${ extraClasses ? ' ' + extraClasses : '' }` }
				style={ getStyleObjectByAttributes( container ) }>
				{ children }
			</Tag>
		);
	}
}
