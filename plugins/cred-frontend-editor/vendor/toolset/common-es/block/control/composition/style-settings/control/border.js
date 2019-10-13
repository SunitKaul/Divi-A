import { Component } from '@wordpress/element';
import { Border } from '../../../index';

export default class extends Component {
	render() {
		const { data, setAttributes } = this.props;

		return (
			<Border border={ data.border } onChange={ border => setAttributes( { border } ) } />
		);
	}
}
