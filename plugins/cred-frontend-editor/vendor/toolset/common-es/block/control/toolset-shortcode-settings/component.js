/**
 * Renders the settings for the selected Toolset Field Type.
 *
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import { Component, Fragment } from '@wordpress/element';
import {
	BaseControl,
	PanelBody,
	RadioControl,
	SelectControl,
	TextControl,
} from '@wordpress/components';

import './scss/edit.scss';

import getFields from './get-fields';
import getInitialOptions from './get-initial-options';

class ToolsetShortcodeSettings extends Component {
	/**
	 * Constructor
	 *
	 * @param {object} props React props
	 */
	constructor( props ) {
		super( props );

		const options = this.getOptions();

		this.state = {
			options,
			previousFieldType: this.props.fieldType,
		};
	}

	getOptions() {
		const fields = this.getFields( this.props.fieldType );

		return !! this.props.options ? this.props.options : getInitialOptions( fields, {} );
	}

	getFields() {
		return getFields( this.props.fieldType );
	}

	triggerOnChangeCallback( fullNewState ) {
		const { onChange } = this.props;
		return onChange( fullNewState );
	}

	isInitialOpen() {
		return false;
	}

	/**
	 * Deep clone object
	 *
	 * @param {object} object Object
	 * @return {object}
	 */
	deepClone( object ) {
		return JSON.parse( JSON.stringify( object ) );
	}

	/**
	 * When update the state changes
	 */
	componentDidUpdate() {
		if ( this.props.fieldType !== this.state.previousFieldType ) {
			const fields = this.getFields();
			this.setState( {
				options: getInitialOptions( fields, {} ),
				previousFieldType: this.props.fieldType,
			} );
		}
	}

	/**
	 * Renders a field settings
	 *
	 * @param {string} key Field key
	 * @param {object} field Field options
	 * @param {string} parentKey Parent key for grouped
	 * @return {Element}
	 */
	renderFieldSettings( key, field, parentKey = null ) {
		const { fieldType } = this.props;
		const statedOptions = this.state.options;

		const doChange = value => {
			const newOption = {};
			newOption[ key ] = value;
			const newState = Object.assign( {}, statedOptions, newOption );

			this.triggerOnChangeCallback( newState );

			this.setState( { options: newState } );
		};

		const className = 'wp-block-toolset-blocks-toolset-shortcode-settings';

		const description = !! field.description ? <p
			className={ `${ className }__description` }
			dangerouslySetInnerHTML={ { __html: field.description } }
		/> : '';

		/**
		 * If the settings has defined `grouped_options` it returns it
		 *
		 * What are `grouped_options`? Some settings have options that depend on a different element (got from `options_filter`)
		 * Instead of loading them using Ajax, it loads all of them and get data depending on `options_filter`
		 *
		 * @returns {object}
		 */
		const getFieldOptions = () => {
			if ( ! field.grouped_options ) {
				return field.options;
			}
			if ( ! field.grouped_options[ this.props[ field.options_filter ] ] ) {
				if ( !! field.grouped_options.default ) {
					return field.grouped_options.default;
				}
				return field.options;
			}
			return field.grouped_options[ this.props[ field.options_filter ] ];
		};
		const fieldOptions = getFieldOptions();
		const options = !! fieldOptions && Object.keys( fieldOptions ).map( optionKey => {
			return {
				value: optionKey,
				label: fieldOptions[ optionKey ],
			};
		} );

		let visible;
		switch ( field.type ) {
			case 'radio':
				visible = true;
				if ( [ 'loop', 'autoplay', 'preload' ].includes( key ) && 'audio' === fieldType.type ) {
					visible = !! statedOptions.output && statedOptions.output === 'normal';
				} else if ( 'style' === key && 'date' === fieldType.type ) {
					visible = !! statedOptions.output && statedOptions.output === 'normal';
				} else if ( 'format' === key && 'date' === fieldType.type ) {
					visible = !! statedOptions.style && statedOptions.style === 'text' && !! statedOptions.output && statedOptions.output === 'normal';
				} else if ( 'align' === key && 'image' === fieldType.type ) {
					visible = !! statedOptions.output && statedOptions.output === 'normal';
				} else if ( 'padding_color' === key && 'image' === fieldType.type ) {
					visible = !! statedOptions.resize && statedOptions.resize === 'pad';
				} else if ( [ 'proportional', 'resize' ].includes( key ) && 'image' === fieldType.type ) {
					visible = !! statedOptions.size && statedOptions.size !== 'full';
				} else if ( [ 'autoplay', 'loop', 'preload' ].includes( key ) && 'video' === fieldType.type ) {
					visible = !! statedOptions.output && statedOptions.output === 'normal';
				}

				const selectedValueRadio = !! statedOptions && !! statedOptions[ key ] ? statedOptions[ key ] : field.defaultForceValue || field.default || field.default_force;

				return ( visible &&
					<Fragment>
						<RadioControl
							label={ field.label || field.header }
							selected={ selectedValueRadio }
							options={ options }
							onChange={ value => doChange( value ) }
						/>
						{ description }
					</Fragment>
				);
			case 'grouped':
			case 'group':
				visible = !! field.hidden || typeof field.hidden === 'undefined';
				if ( 'outputCustomCombo' === key && 'checkbox' === fieldType.type ) {
					visible = !! statedOptions.output && statedOptions.output === 'custom';
				} else if ( 'outputCustomCombo' === key && 'radio' === fieldType.type ) {
					visible = !! statedOptions.output && statedOptions.output === 'custom';
				} else if ( 'attributesCombo' === key && 'email' === fieldType.type ) {
					visible = !! statedOptions.output && statedOptions.output !== 'raw';
				} else if ( 'outputCustomCombo' === key && 'checkboxes' === fieldType.type ) {
					visible = !! statedOptions.output && statedOptions.output === 'custom';
				} else if ( 'attributesCombo' === key && 'file' === fieldType.type ) {
					visible = !! statedOptions.output && statedOptions.output === 'normal';
				} else if ( 'attributesCombo' === key && 'image' === fieldType.type ) {
					visible = !! statedOptions.output && statedOptions.output === 'normal';
				} else if ( [ 'attributesCombo', 'titleAltCombo' ].includes( key ) && 'image' === fieldType.type ) {
					visible = !! statedOptions.output && statedOptions.output === 'normal';
				} else if ( key === 'size' && 'image' === fieldType.type ) {
					visible = !! statedOptions.style && statedOptions.style !== 'raw';
				} else if ( key === 'sizeCombo' && 'image' === fieldType.type ) {
					visible = !! statedOptions.size && statedOptions.size === 'custom';
				} else if ( key === 'skype_button_style_enhanced' && 'skype' === fieldType.type ) {
					visible = !! statedOptions.button && statedOptions.button !== 'bubble' && !! statedOptions.output && statedOptions.output !== 'raw';
				} else if ( key === 'skype_button_style' && 'skype' === fieldType.type ) {
					visible = !! statedOptions.output && statedOptions.output !== 'raw';
				} else if ( key === 'skype_chat_style' && 'skype' === fieldType.type ) {
					visible = !! statedOptions.output && statedOptions.output !== 'raw';
				} else if ( 'sizeCombo' === key && 'video' === fieldType.type ) {
					visible = !! statedOptions.output && statedOptions.output === 'normal';
				} else if ( 'attributesCombo' === key ) {
					visible = !! statedOptions.output && statedOptions.output === 'raw';
				} else if ( 'sizeCombo' === key ) {
					visible = !! statedOptions.output && statedOptions.output !== 'raw';
				} else if ( !! this.isSettingVisible ) {
					visible = this.isSettingVisible( key, field, statedOptions, parentKey );
				}

				if ( 'outputCustomCombo' === key && [ 'checkboxes', 'radio' ].includes( fieldType.type ) ) {
					// I have to duplicate each group for each checkboxes option
					const list = [];
					Object.keys( fieldType.fieldOptions )
						.filter( fieldOptionKey => fieldOptionKey !== 'default' )
						.forEach( ( fieldOptionKey, index ) => {
							const fieldOption = fieldType.fieldOptions[ fieldOptionKey ];
							const newFields = this.deepClone( field.fields ); // Subobjects are references
							Object.keys( newFields )
								.forEach( itemFieldKey => {
									if ( !! fieldOption.title ) {
										newFields[ itemFieldKey ].pseudolabel = newFields[ itemFieldKey ].pseudolabel.replace( '%%OPTION%%', fieldOption.title );
									}
								} );
							Object.keys( newFields ).forEach( ( keyNewFields ) => {
								newFields[ `${ keyNewFields }_${ index }` ] = newFields[ keyNewFields ];
								delete newFields[ keyNewFields ];
							} );
							list.push( this.renderFields( newFields, key ) );
						} );
					return ( visible &&
						<Fragment>
							<BaseControl label={ field.label } >
								{ list }
							</BaseControl>
							{ description }
						</Fragment>
					);
				}

				return ( visible &&
					<Fragment>
						<BaseControl label={ field.label } >
							{ this.renderFields( field.fields, key ) }
						</BaseControl>
						{ description }
					</Fragment>
				);
			case 'text':
				visible = true;
				if ( 'title' === key && 'email' === fieldType.type ) {
					visible = !! statedOptions.output && statedOptions.output !== 'raw';
				} else if ( 'format' === key && 'numeric' === fieldType.type ) {
					visible = !! statedOptions.output && statedOptions.output !== 'raw';
				} else if ( 'separator' === key && 'checkboxes' === fieldType.type ) {
					visible = !! statedOptions.output && statedOptions.output !== 'custom';
				} else if ( 'toolsetCombo:format' === key && 'date' === fieldType.type ) {
					visible = !! statedOptions.format && statedOptions.format === 'toolsetCombo' && !! statedOptions.style && statedOptions.style === 'text';
				} else if ( 'title' === key && 'file' === fieldType.type ) {
					visible = !! statedOptions.output && statedOptions.output !== 'raw';
				} else if ( 'toolsetCombo:padding_color' === key && 'image' === fieldType.type ) {
					visible = !! statedOptions.padding_color && statedOptions.padding_color === 'toolsetCombo' && !! statedOptions.resize && statedOptions.resize === 'pad';
				} else if ( 'class' === key && 'skype' === fieldType.type ) {
					visible = !! statedOptions.output && statedOptions.output !== 'raw';
				} else if ( 'poster' === key && 'video' === fieldType.type ) {
					visible = !! statedOptions.output && statedOptions.output === 'normal';
				} else if ( !! this.isSettingVisible ) {
					visible = this.isSettingVisible( key, field, statedOptions, parentKey );
				}

				return ( visible &&
					<TextControl
						label={ field.label || field.pseudolabel }
						value={ statedOptions[ key ] }
						onChange={ value => doChange( value ) }
						help={ field.description }
						placeholder={ field.placeholder }
					/>
				);
			case 'select':
				visible = true;
				if ( 'receiver' === key && 'skype' === fieldType.type ) {
					visible = !! statedOptions.output && statedOptions.output !== 'raw';
				} else if ( !! this.isSettingVisible ) {
					visible = this.isSettingVisible( key, field, statedOptions, parentKey );
				}

				const selectedValueSelect = !! statedOptions && !! statedOptions[ key ] ? statedOptions[ key ] : field.defaultForceValue || field.default || field.default_force;

				return ( visible &&
					<Fragment>
						<SelectControl
							label={ field.label || field.pseudolabel }
							value={ selectedValueSelect }
							options={ options }
							onChange={ value => doChange( value ) }
						/>
						{ description }
					</Fragment>
				);
			default:
				return '';
		}
	}

	/**
	 * Renders a list of fields
	 *
	 * @param {array} fields List of fields
	 * @param {string} parentKey Parent key for grouped
	 * @return {Element}
	 */
	renderFields( fields, parentKey = null ) {
		return Object.keys( fields ).map( field => {
			// Deep object copy
			const fieldCopy = fields[ field ];
			const html = this.renderFieldSettings( field, fieldCopy, parentKey );
			if ( ! html ) {
				return null;
			}
			return <div className="tb-control-spacing" key={ `toolset-settings-${ field }` } >
				{ html }
			</div>;
		} );
	}

	getTitle() {
		if ( this.props.title ) {
			return this.props.title;
		}
		return __( 'Field Settings', 'wpv-views' );
	}

	/**
	 * Render method
	 *
	 * @return {Element}
	 */
	render() {
		const fields = this.getFields();

		if ( ! Object.keys( fields ).length || ! Object.keys( fields.displayOptions.fields ).length ) {
			return '';
		}

		return ( !! fields &&
			<PanelBody title={ this.getTitle() } initialOpen={ this.isInitialOpen() } key="toolset-shortcode-settings-panel">
				{ this.renderFields( this.deepClone( fields.displayOptions.fields ) ) }
			</PanelBody>
		);
	}
}

export default ToolsetShortcodeSettings;
