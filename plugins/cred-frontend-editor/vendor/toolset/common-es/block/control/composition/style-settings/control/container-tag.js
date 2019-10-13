/* WordPress dependencies */
import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { SelectControl } from '@wordpress/components';

/* Internal dependencies */
import { NO_CONTAINER_VALUE } from '../../../../wrapper/container/settings';

export default class extends Component {
	render() {
		const { data, setAttributes, disableNone } = this.props;

		const options = [
			{ value: 'div', label: 'div' },
			{ value: 'article', label: 'article' },
			{ value: 'aside', label: 'aside' },
			{ value: 'figure', label: 'figure' },
			{ value: 'figcaption', label: 'figcaption' },
			{ value: 'footer', label: 'footer' },
			{ value: 'header', label: 'header' },
			{ value: 'main', label: 'main' },
			{ value: 'nav', label: 'nav' },
			{ value: 'section', label: 'section' },
			{ value: 'summary', label: 'summary' },
		];

		if ( disableNone !== true ) {
			options.unshift( { value: NO_CONTAINER_VALUE, label: __( 'none', 'wpv-views' ) } );
		}

		return (
			<SelectControl
				label={ __( 'Container Element', 'wpv-views' ) }
				value={ data.tag }
				options={ options }
				onChange={ tag => setAttributes( { tag } ) }
				help={ data.tag === NO_CONTAINER_VALUE ? __( 'Chose a container for more options.', 'wpv-views' ) : null }
			/>
		);
	}
}
