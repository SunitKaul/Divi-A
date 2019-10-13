import { Component } from '@wordpress/element';
import { PaddingMarginControl } from '../../../index';

export default class extends Component {
	render() {
		const { data, setAttributes } = this.props;

		return (
			<PaddingMarginControl
				isInitiallyOpen={ false }
				margin={ data.margin }
				padding={ data.padding }
				onToggle={ ( checked ) => setAttributes( {
					margin: { ...data.margin, enabled: checked },
					padding: { ...data.padding, enabled: checked },
				} ) }
				onChangeMargin={ margin => setAttributes( { margin } ) }
				onChangePadding={ padding => setAttributes( { padding } ) }
			/>
		);
	}
}

