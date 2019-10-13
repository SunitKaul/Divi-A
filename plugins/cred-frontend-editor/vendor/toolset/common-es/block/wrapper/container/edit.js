import { isEmpty } from 'lodash';
import { Fragment, Component } from '@wordpress/element';
import { ColorIndicator, PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/editor';
import { CommonControls, getStyleObjectByAttributes } from '../../control/composition';
import {
	ControlContainerTag,
	ControlInline,
	ControlIdCssClasses,
} from '../../control/composition/style-settings/control';
import { NO_CONTAINER_VALUE, defaults } from './settings';
import { getDifferenceOfObjects } from '../../../utils';
import './scss/edit.scss';

class Edit extends Component {
	constructor() {
		super( ...arguments );

		this.setAttributes = this.setAttributes.bind( this );
	}

	getDifferenceFromDefaults( data ) {
		if ( data === undefined ) {
			return {};
		}
		data = { ...defaults, ...data };

		return getDifferenceOfObjects( defaults, data );
	}

	setAttributes( newData ) {
		const { setAttributes, data } = this.props;

		const newDataMergedWithPrevious = { ...data, ...newData };
		const container = this.getDifferenceFromDefaults( newDataMergedWithPrevious );

		setAttributes( { container } );
	}

	normaliseString( string ) {
		if ( typeof string !== 'string' || ! string.trim() ) {
			return '';
		}

		return string;
	}

	renderEditorView() {
		const { children, data, forceTagOnEdit, extraClassString } = this.props;
		const container = { ...defaults, ...data };

		let Tag = container.tag !== NO_CONTAINER_VALUE ? container.tag : false;
		Tag = forceTagOnEdit || Tag;

		const extraClasses = this.normaliseString( extraClassString );

		// if no container, nut extraClassString is used we use div
		Tag = ! Tag && extraClasses !== '' ? 'div' : Tag;

		if ( ! Tag ) {
			// no container selected
			return (
				<Fragment>
					{ children }
				</Fragment>
			);
		}

		return (
			<Fragment>
				<Tag
					id={ container.id || null }
					className={ `tb-container${ container.cssClasses ? ' ' + container.cssClasses : '' }${ extraClasses ? ' ' + extraClasses : '' }` }
					style={ getStyleObjectByAttributes( container ) }>
					{ children }
				</Tag>
			</Fragment>

		);
	}

	render() {
		const { data, initialOpen, controls, passThrough, labels, disableNone } = this.props;
		const container = { ...defaults, ...data };

		const titleWithColorIndicators = (
			<Fragment>
				{ __( 'Container', 'wpv-views' ) }
				<span>
					{ container.textColor &&
						<ColorIndicator
							key="title-text-color"
							colorValue={ container.textColor }
						/>
					}
					{ container.backgroundColor &&
						<ColorIndicator
							key="title-background-color"
							colorValue={ container.backgroundColor }
						/>
					}
				</span>
			</Fragment>
		);

		if ( isEmpty( data ) ) {
			return this.renderEditorView();
		}

		return (
			<Fragment>
				<InspectorControls>
					<PanelBody title={ titleWithColorIndicators } initialOpen={ initialOpen || false }>
						<ControlContainerTag setAttributes={ this.setAttributes } data={ container } disableNone={ disableNone } />
						{ container.tag !== NO_CONTAINER_VALUE &&
							<Fragment>
								{ controls.includes( 'inline' ) &&
									<ControlInline
										setAttributes={ this.setAttributes }
										data={ container }
									/>
								}

								{ controls.includes( 'id' ) &&
									<ControlIdCssClasses
										setAttributes={ this.setAttributes }
										data={ container }
									/>
								}

								<CommonControls
									data={ container }
									controls={ controls }
									setAttributes={ this.setAttributes }
									passThrough={ passThrough }
									labels={ labels }
								/>
							</Fragment>
						}
					</PanelBody>
				</InspectorControls>
				{ this.renderEditorView() }
			</Fragment>
		);
	}
}

Edit.defaultProps = {
	controls: [],
	passThrough: {},
	labels: {},
};

export default Edit;
