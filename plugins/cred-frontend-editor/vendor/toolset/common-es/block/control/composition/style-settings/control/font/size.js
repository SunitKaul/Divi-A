import { fontSizes } from '../../../../../../utils';
import { FontSizePicker } from '@wordpress/components';
import { Component } from '@wordpress/element';

export default class extends Component {
	render() {
		const { data, setAttributes } = this.props;

		return (
			<div className="tces-font-size-picker">
				<FontSizePicker
					fontSizes={ fontSizes() }
					value={ data.fontSize }
					onChange={ fontSize => setAttributes( { fontSize } ) }
				/>
			</div>
		);
	}
}
