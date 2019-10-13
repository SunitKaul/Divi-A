const DEFAULT_BORDER = {
	style: 'solid',
	width: null,
	widthUnit: 'px',
	color: { hex: '#000000', rgb: { r: 0, g: 0, b: 0, a: 1 } },
};

export const defaults = {
	font: undefined,
	fontVariant: undefined,
	fontSize: undefined,
	fontStyle: [],
	fontWeight: undefined,
	lineHeight: undefined,
	lineHeightUnit: 'px',
	letterSpacing: undefined,
	letterSpacingUnit: 'px',
	textColor: {},
	textTransform: undefined,
	textDecoration: [],
	textShadow: {
		enabled: false,
		color: { hex: '#000000', rgb: { r: 0, g: 0, b: 0, a: 0.5 } },
		horizontal: 5,
		vertical: 5,
		blur: 10,
	},
	background: {
		type: 'solid',
		solid: {
			color: {},
		},
		gradient: {
			colors: [
				{ rgb: { r: 0, g: 0, b: 0, a: 1 } },
				{ rgb: { r: 255, g: 255, b: 255, a: 1 } },
			],
			type: 'linear',
			angle: undefined,
		},
		image: {
			horizontal: {},
			vertical: {},
		},
	},
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
