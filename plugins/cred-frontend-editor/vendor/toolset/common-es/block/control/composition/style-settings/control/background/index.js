// External Dependencies

// WordPress Dependencies
import { Component, Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { SelectControl } from '@wordpress/components';

// Internal Dependencies
import { Solid } from './control/solid';
import { Gradient } from './control/gradient';
import { Image } from './control/image';
import { deepMerge } from '../../../../../../utils';

export default class extends Component {
	constructor() {
		super( ...arguments );

		this.setBackground = this.setBackground.bind( this );
	}

	renderControls( type ) {
		const { background } = this.props.data;

		switch ( type ) {
			case 'gradient':
				return <Gradient background={ background } setBackground={ this.setBackground } />;
			case 'image':
				return <Image passThrough={ this.props.passThrough } background={ background } setBackground={ this.setBackground } />;
			default:
				return <Solid background={ background } setBackground={ this.setBackground } />;
		}
	}

	setBackground( newAttributes ) {
		const { data, setAttributes } = this.props;
		const newBackground = deepMerge(
			data.background,
			newAttributes,
			{ arrayMerge: ( destinationArray, sourceArray ) => sourceArray }
		);

		if ( JSON.stringify( newBackground ) !== JSON.stringify( data.background ) ) {
			setAttributes( { background: newBackground } );
		}
	}

	render() {
		const { data, setAttributes } = this.props;

		const options = [
			{ value: 'solid', label: __( 'Solid', 'wpv-views' ) },
			{ value: 'gradient', label: __( 'Gradient', 'wpv-views' ) },
			{ value: 'image', label: __( 'Image', 'wpv-views' ) },
		];

		return (
			<Fragment>
				<SelectControl
					label={ __( 'Type', 'wpv-views' ) }
					value={ data.background.type }
					options={ options }
					onChange={ type => setAttributes( { background: { ...data.background, type } } ) }
				/>

				{ this.renderControls( data.background.type ) }
			</Fragment>
		);
	}
}
