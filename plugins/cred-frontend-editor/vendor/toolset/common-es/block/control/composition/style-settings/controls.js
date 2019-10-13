// WordPress dependencies
import { Fragment, Component } from '@wordpress/element';
import { ColorIndicator, PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/editor';
import { merge } from 'lodash';

// Internal dependencies
import { defaults } from './settings';
import CommonControls from './utils/common-controls';
import { getDifferenceOfObjects } from '../../../../utils';

class Control extends Component {
	constructor() {
		super( ...arguments );

		this.setAttributes = this.setAttributes.bind( this );
	}

	getDifferenceFromDefaults( data ) {
		if ( data === undefined ) {
			return {};
		}

		const defaultsBlock = this.props.defaults || {};
		const defaultsMerged = { ...defaults, ...defaultsBlock };
		data = { ...defaultsMerged, ...data };

		const diffFromDefaults = getDifferenceOfObjects( defaultsMerged, data );

		Object.keys( data ).forEach( key => {
			if ( ! defaults.hasOwnProperty( key ) ) {
				diffFromDefaults[ key ] = data[ key ];
			}
		} );

		return diffFromDefaults;
	}

	setAttributes( newData ) {
		const { setAttributes, data, storageKey } = this.props;

		const newDataMergedWithPrevious = { ...data, ...newData };
		const style = this.getDifferenceFromDefaults( newDataMergedWithPrevious );
		const key = storageKey || 'style';

		setAttributes( { [ key ]: style } );
	}

	render() {
		const { data, description, initialOpen, controls, labels, renderControlsOnly, renderPanelWithControlsOnly, passThrough, controlsMapping, preset } = this.props;
		const style = merge( {}, defaults, this.props.defaults || {}, data );

		const presetTypography = preset === 'typography';
		const renderControls = ( ! Array.isArray( controls ) || controls.length === 0 ) && presetTypography ?
			[ 'fontFamily', 'fontSize', 'fontIconToolbar', 'lineHeight', 'letterSpacing', 'textColor', 'textTransform', 'textShadow' ] :
			controls;

		const titleWithColorIndicators = (
			<Fragment>
				{ presetTypography ? __( 'Typography', 'wpv-views' ) : __( 'Style Settings', 'wpv-views' ) }
				<span>
					{ style.textColor && renderControls.includes( 'textColor' ) &&
					<ColorIndicator
						key="title-text-color"
						colorValue={ style.textColor }
					/>
					}
					{ style.backgroundColor && renderControls.includes( 'backgroundColor' ) &&
					<ColorIndicator
						key="title-background-color"
						colorValue={ style.backgroundColor }
					/>
					}
				</span>
			</Fragment>
		);

		const mainControl = <CommonControls
			data={ style }
			controls={ renderControls }
			controlsMapping={ controlsMapping }
			setAttributes={ this.setAttributes }
			labels={ labels }
			passThrough={ passThrough }
		/>;

		const panelWithMainControl = <PanelBody title={ titleWithColorIndicators } initialOpen={ initialOpen || false }>
			{ description &&
			<p>{ description }</p>
			}
			{
				mainControl
			}
		</PanelBody>;

		if ( renderControlsOnly ) {
			return mainControl;
		}

		if ( renderPanelWithControlsOnly ) {
			return panelWithMainControl;
		}

		return (
			<InspectorControls>
				{
					panelWithMainControl
				}
			</InspectorControls>
		);
	}
}

Control.defaultProps = {
	controls: [],
	passThrough: {},
	labels: {},
	renderControlsOnly: false,
	renderPanelWithControlsOnly: false,
	disableColorIdentificator: [],
	controlsMapping: {},
};

export default Control;
