export const NO_CONTAINER_VALUE = 'none';

const DEFAULT_BORDER = {
	style: 'solid',
	width: null,
	widthUnit: 'px',
	color: { hex: '#000000', rgb: { r: 0, g: 0, b: 0, a: 1 } },
};

export const defaults = {
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
