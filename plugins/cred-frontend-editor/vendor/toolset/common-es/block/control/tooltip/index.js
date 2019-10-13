import { Component } from '@wordpress/element';
import Tippy from '@tippy.js/react';
import PropTypes from 'prop-types';

class Tooltip extends Component {
	render() {
		const {
			children,
			text,
			arrow,
			arrowType,
			animation,
			duration,
			delay,
			trigger,
			maxWidth,
		} = this.props;

		return (
			<Tippy
				content={ text }
				arrow={ arrow }
				arrowType={ arrowType }
				animation={ animation }
				duration={ duration }
				delay={ delay }
				trigger={ trigger }
				maxWidth={ maxWidth }
			>
				{ children }
			</Tippy>
		);
	}
}

Tooltip.defaultProps = {
	text: '',
	arrow: true,
	arrowType: 'sharp',
	animation: 'scale',
	duration: 0,
	delay: [ 300, 0 ],
	trigger: 'mouseenter focus',
	maxWidth: 350,
};

Tooltip.propTypes = {
	text: PropTypes.string,
	arrow: PropTypes.bool,
	arrowType: PropTypes.string,
	animation: PropTypes.string,
	duration: [
		PropTypes.number,
		PropTypes.array,
	],
	delay: [
		PropTypes.number,
		PropTypes.array,
	],
	trigger: PropTypes.string,
	maxWidth: [
		PropTypes.number,
		PropTypes.string,
	],
};

export default Tooltip;
