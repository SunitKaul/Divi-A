/**
 * Displays a list of icons depending on a set of CSS rules
 *
 * @since 1.0.0
 */

import './scss/edit.scss';

import {
	Component,
	Fragment,
} from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import PropTypes from 'prop-types';

import {
	BaseControl,
	Button,
	Dropdown,
	Notice,
	SelectControl,
	TextControl,
	ToggleControl,
	Tooltip,
} from '@wordpress/components';
import loadCustomCSS from './utils/load-custom-css';
import rulesFromCssText from './utils/rules-from-css-text';

/**
 * Displays a combo used for searching CDN assets in CDNjs
 */
class IconSelector extends Component {
	/**
	 * Constructor
	 *
	 * @param {object} props React props
	 */
	constructor( props ) {
		super( props );
		this.state = {
			filter: '',
			rules: [],
			currentRule: '',
			fontFamily: this.props.fontFamily,
			parsedRules: {},
			toggleChecked: false,
		};
	}

	iconFonts = [
		/* todo get rid of the toolsetBlocksStrings dependency */
		{ label: 'Dashicons', value: window.toolsetBlocksStrings.extra.dashiconsURL },
		{ label: 'FontAwesome', value: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css' },
		{ label: 'Ionicons', value: 'https://cdnjs.cloudflare.com/ajax/libs/ionicons/4.4.8/css/ionicons.min.css' },
	]

	/**
	 * Gets the font-family name and the icon styles
	 *
	 * @return {object}
	 */
	parseRules() {
		const rules = this.state.rules[ this.state.currentRule ];
		if ( ! rules ) {
			return;
		}
		const result = {
			fontFamily: '',
			rules: [],
		};
		rules.some( sheet => {
			const isFontFace = 'CSSFontFaceRule' === sheet.constructor.name;
			if ( isFontFace ) {
				result.fontFamily = sheet.style.getPropertyValue( 'font-family' );
			}
			return isFontFace;
		} );
		rules.forEach( sheet => {
			if ( !! sheet.selectorText &&
				sheet.selectorText.match( /::before/ ) &&
				sheet.style.getPropertyValue( 'content' ) &&
				! sheet.style.getPropertyValue( 'content' ).match( /attr/ )
			) {
				result.rules.push( {
					tag: sheet.selectorText.replace( /::.*/, '' ).substr( 1 ),
					// content includes double quotes, don't remove them because the string will be translated to its unicode char: "\u2606" -> ☆
					fontCode: sheet.style.getPropertyValue( 'content' ).replace( /"/g, '' ).replace( /\\\\/g, '\\' ),
				} );
			}
		} );
		this.setState( { fontFamily: result.fontFamily } );
		this.props.onChangeFontFamily( result.fontFamily );
		return result;
	}

	/**
	 * Translates a font code for CSS attr usage
	 *
	 * @param {string} fontCode Font code (pe \f201)
	 * @return {string}
	 * @link https://github.com/facebook/react/issues/3769#issuecomment-97163582
	 */
	formatCode( fontCode ) {
		if ( ! fontCode ) {
			return '';
		}
		return String.fromCharCode( parseInt( fontCode.replace( '\\', '' ), 16 ) );
	}

	/**
	 * Gets an button for a font icon code
	 *
	 * @param {string} className Root class name
	 * @param {string} fontFamily Font family
	 * @param {string} fontCode Current font code
	 * @param {integer} index Any index
	 * @return {Button}
	 * @since 1.0.0
	 */
	iconForRule( className, fontFamily, fontCode, index ) {
		return (
			<Button
				key={ className + index }
				isDefault
				className={ className }
				style={ { fontFamily: fontFamily } }
				// Quotes must be removed to get only code point
				data-font-code={ this.formatCode( fontCode ) }
				onClick={ () => this.props.onChangeFontCode( fontCode ) }
			/>
		);
	}

	/**
	 * Filter the rules and format them into React Buttons
	 *
	 * @param {object} parsedRules Rules got from CSS file { fontFamily: string, rules: CSSStyleRule[] }
	 * @param {string} rootClassName Class name
	 * @return {Button[]}
	 * @since 1.0.0
	 */
	filterAndFormatRules( parsedRules, rootClassName ) {
		if ( ! parsedRules.rules ) {
			return [];
		}
		return parsedRules.rules
			.filter( rule => ! this.state.filter || rule.tag.indexOf( this.state.filter ) !== -1 )
			.map( ( rule, index ) => this.iconForRule( `${ rootClassName }__icon`, parsedRules.fontFamily, rule.fontCode, index ) );
	}

	/**
	 * Actions after mount
	 * - Set parsed rules to be displayed
	 *
	 * @since 1.0.0
	 */
	componentDidMount() {
		this.setState( { parsedRules: this.parseRules() } );
		const { cssFontURL } = this.props;
		const url = !! cssFontURL ? cssFontURL : this.iconFonts[ 0 ].value;
		this.onChangeCssURLActions( url );
	}

	/**
	 * Actions triggered when the CSS URL has changed
	 *
	 * @param {string} value URL
	 * @since 1.0.0
	 */
	onChangeCssURLActions( value ) {
		const {
			onChangeCssURL,
		} = this.props;

		loadCustomCSS( value );
		rulesFromCssText( value, ( id, cssList ) => {
			this.setState( { currentRule: id } );
			this.setState( { rules: cssList } );
			this.setState( { parsedRules: this.parseRules() } );
		} );
		onChangeCssURL( value );
		this.setState( { filter: '' } );
	}

	/**
	 * Gets the content for the modal
	 *
	 * @param {string} rootClassName Class name
	 * @return {Component}
	 * @since 1.0.0
	 */
	getModalContent( rootClassName ) {
		const {
			cssFontURL,
			fontCode,
			onChangeFontCode,
			onChangeFontFamily,
		} = this.props;

		return (
			<div className={ `${ rootClassName }__content` }>
				<SelectControl
					label={ __( 'Select your set of icons', 'wpv-views' ) }
					options={ this.iconFonts }
					onChange={ item => {
						this.onChangeCssURLActions( item );
						onChangeFontCode( '' );
					} }
					value={ cssFontURL }
				/>

				{ !! this.state.parsedRules && !! this.state.parsedRules.rules && !! this.state.parsedRules.rules.length && (
					<TextControl
						value={ this.state.filter }
						onChange={ value => this.setState( { filter: value } ) }
						className={ `${ rootClassName }__search` }
						// translators: there is a list of icons user can filter.
						label={ __( 'Search', 'wpv-views' ) }
					/>
				) }
				<div className={ `${ rootClassName }__list` }>
					{ !! this.state.parsedRules && this.filterAndFormatRules( this.state.parsedRules, rootClassName ) }
				</div>
				{ !! this.state.parsedRules && !! this.state.parsedRules.rules && ! this.state.parsedRules.rules.length && (
					<Notice status="warning" className={ `${ rootClassName }__notice` }>
						{ __( 'No icons found, try Expert Settings', 'wpv-views' ) }
					</Notice>
				) }
				<ToggleControl
					// translators: some extra settings are displayed in the 'Expert settings' section
					label={ __( 'Expert Settings', 'wpv-views' ) }
					checked={ this.state.toggleChecked }
					onChange={ value => this.setState( { toggleChecked: value } ) }
				/>
				{ this.state.toggleChecked && (
					<Fragment>
						{ /* translators: An URL to a css file */ }
						<BaseControl label={ __( 'CSS File URL', 'wpv-views' ) }>
							<TextControl value={ cssFontURL } onChange={ value => this.onChangeCssURLActions( value ) } />
						</BaseControl>
						{ /* translators: Then name of the font to use in the CSS rules */ }
						<BaseControl label={ __( 'Font Family Name', 'wpv-views' ) }>
							<TextControl value={ this.state.fontFamily } onChange={ value => {
								this.setState( { fontFamily: value } );
								onChangeFontFamily( value );
							} } />
						</BaseControl>
						{ /* translators: The font code (p.e. \f155) to be used for displaying a filled star */ }
						<BaseControl label={ __( 'Font Code', 'wpv-views' ) }>
							<TextControl
								value={ fontCode }
								onChange={ value => onChangeFontCode( value ) }
								placeholder="\f155"
							/>
						</BaseControl>
					</Fragment>
				) }
			</div>
		);
	}

	/**
	 * Render method
	 *
	 * @return {Component}
	 * @since 1.0.0
	 */
	render() {
		const {
			fontCode,
			fontFamily,
			label,
		} = this.props;

		const rootClassName = 'tb-icon-selector';

		return (
			<BaseControl
				label={ label }
				className={ rootClassName }
			>
				<Dropdown
					position="left bottom"
					renderToggle={ ( { isOpen, onToggle } ) => (
						// translators: it is a tooltip that explains that the user could select a different icon when clicking on it (button)
						<Tooltip text={ __( 'Replace Icon', 'wpv-views' ) }>
							<Button
								aria-expanded={ isOpen }
								onClick={ onToggle }
								className={ `${ rootClassName }__button` }
								data-font-code={ this.formatCode( fontCode ) }
								style={ { fontFamily } }
							/>
						</Tooltip>
					) }
					renderContent={ () => this.getModalContent( rootClassName ) }
				/>
			</BaseControl>
		);
	}
}

IconSelector.defaultProps = {
	label: __( 'Icon', 'wpv-views' ),
	cssFontURL: '',
	fontCode: '',
	fontFamily: '',
};

IconSelector.propTypes = {
	label: PropTypes.string,
	cssFontURL: PropTypes.string.isRequired,
	fontCode: PropTypes.string.isRequired,
	fontFamily: PropTypes.string.isRequired,
	onChangeCssURL: PropTypes.func.isRequired,
	onChangeFontCode: PropTypes.func.isRequired,
	onChangeFontFamily: PropTypes.func.isRequired,
};

export default IconSelector;
