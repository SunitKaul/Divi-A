import { Component } from '@wordpress/element';

import { Rotate } from '../../../index';

export default class extends Component {
	render() {
		const { data, setAttributes } = this.props;

		return (
			<Rotate
				value={ data.rotate }
				onChange={ val => setAttributes( { rotate: parseInt( val, 10 ) } ) }
			/>
		);
	}
}
