/**
 * Padding and margin control
 *
 * @since 1.0.0
 */

// External dependencies
import PropTypes from 'prop-types';

// WordPress dependencies
import {
	Component,
	Fragment,
} from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	ToggleControl,
	PanelRow,
} from '@wordpress/components';

import './scss/edit.scss';

const DEFAULT_PADDING_VALUE = {
	enabled: false,
	paddingTop: '',
	paddingLeft: '',
	paddingRight: '',
	paddingBottom: '',
};
const DEFAULT_MARGIN_VALUE = {
	enabled: false,
	marginTop: '',
	marginLeft: '',
	marginRight: '',
	marginBottom: '',
};

/**
 * Padding and margin control
 * Displays a box with margin/padding structure to set each element (top, botton, left, right)
 *
 * @since 1.0.0
 */
class PaddingMarginControl extends Component {
	constructor( props ) {
		super( props );

		const padding = Object.assign( {}, DEFAULT_PADDING_VALUE, props.padding );
		const margin = Object.assign( {}, DEFAULT_MARGIN_VALUE, props.margin );
		this.state = {
			toggleChecked: ( !! props.margin && props.margin.enabled ) || ( !! props.padding && props.padding.enabled ),
			padding,
			margin,
		};
	}

	render() {
		const {
			label,
			onChangePadding,
			onChangeMargin,
			onToggle,
		} = this.props;
		const rootClassName = 'wp-block-toolset-blocks-padding-margin';

		const toggleChangedCallback = checked => {
			if ( typeof onToggle === 'function' ) {
				onToggle( checked );
			} else {
				if ( typeof onChangePadding === 'function' ) {
					onChangePadding( { ...this.state.padding, enabled: checked } );
				}
				if ( typeof onChangeMargin === 'function' ) {
					onChangeMargin( { ...this.state.margin, enabled: checked } );
				}
			}

			this.setState( { toggleChecked: checked } );
		};

		const onChangeValueMargin = value => {
			if ( ! this.state.toggleChecked ) {
				return DEFAULT_MARGIN_VALUE;
			}
			this.setState( { margin: Object.assign( this.state.margin, value, { enabled: true } ) } );
			if ( typeof onChangeMargin === 'function' ) {
				onChangeMargin( Object.assign( {}, this.state.margin, { enabled: true } ) );
			}
		};

		const onChangeValuePadding = value => {
			if ( ! this.state.toggleChecked ) {
				return DEFAULT_PADDING_VALUE;
			}
			this.setState( { padding: Object.assign( this.state.padding, value, { enabled: true } ) } );
			if ( typeof onChangePadding === 'function' ) {
				onChangePadding( Object.assign( {}, this.state.padding, { enabled: true } ) );
			}
		};

		const deepClone = object => JSON.parse( JSON.stringify( object ) );

		const setUnitsToPadding = () => {
			const padding = deepClone( this.state.padding );
			Object.keys( padding ).forEach( key => {
				if ( padding[ key ] === '-' ) {
					// we don't want the placeholder as value
					padding[ key ] = '';
				} else if ( ! isNaN( padding[ key ] ) && padding[ key ] !== '' && key !== 'enabled' ) {
					padding[ key ] = `${ padding[ key ] }px`;
				}
			} );

			this.setState( { padding } );
			if ( typeof onChangePadding === 'function' ) {
				onChangePadding( padding );
			}
		};

		const setUnitsToMargin = () => {
			const margin = deepClone( this.state.margin );
			Object.keys( margin ).forEach( key => {
				if ( margin[ key ] === '-' ) {
					// we don't want the placeholder as value
					margin[ key ] = '';
				} else if ( ! isNaN( margin[ key ] ) && margin[ key ] !== '' && key !== 'enabled' ) {
					margin[ key ] = `${ margin[ key ] }px`;
				}
			} );
			this.setState( { margin } );
			if ( typeof onChangeMargin === 'function' ) {
				onChangeMargin( margin );
			}
		};

		return (
			<Fragment>
				<PanelRow>
					<ToggleControl
						label={ label }
						checked={ this.state.toggleChecked }
						onChange={ toggleChangedCallback }
					/>
				</PanelRow>

				{ this.state.toggleChecked ?
					(
						<div className={ rootClassName }>
							<div className={ `${ rootClassName }__item1 ${ rootClassName }__cell` } data-label={ __( 'margin', 'wpv-views' ) }>
								<input type="text" value={ this.state.margin.marginTop }
									onChange={ event => onChangeValueMargin( { marginTop: event.target.value } ) }
									onBlur={ setUnitsToMargin }
									placeholder="-"
								/>
							</div>
							<div className={ `${ rootClassName }__item2 ${ rootClassName }__cell` } data-label={ __( 'padding', 'wpv-views' ) }>
								<input type="text" value={ this.state.padding.paddingTop }
									onChange={ event => onChangeValuePadding( { paddingTop: event.target.value } ) }
									onBlur={ setUnitsToPadding }
									placeholder="-"
								/>
							</div>
							<div className={ `${ rootClassName }__item3 ${ rootClassName }__cell` }>
								<input type="text" value={ this.state.margin.marginLeft }
									onChange={ event => onChangeValueMargin( { marginLeft: event.target.value } ) }
									onBlur={ setUnitsToMargin }
									placeholder="-"
								/>
							</div>
							<div className={ `${ rootClassName }__item4 ${ rootClassName }__cell` }>
								<input type="text" value={ this.state.padding.paddingLeft }
									onChange={ event => onChangeValuePadding( { paddingLeft: event.target.value } ) }
									onBlur={ setUnitsToPadding }
									placeholder="-"
								/>
							</div>
							<div className={ `${ rootClassName }__item5 ${ rootClassName }__cell` }>
								<input type="text" value={ this.state.padding.paddingRight }
									onChange={ event => onChangeValuePadding( { paddingRight: event.target.value } ) }
									onBlur={ setUnitsToPadding }
									placeholder="-"
								/>
							</div>
							<div className={ `${ rootClassName }__item6 ${ rootClassName }__cell` }>
								<input type="text" value={ this.state.margin.marginRight }
									onChange={ event => onChangeValueMargin( { marginRight: event.target.value } ) }
									onBlur={ setUnitsToMargin }
									placeholder="-"
								/>
							</div>
							<div className={ `${ rootClassName }__item7 ${ rootClassName }__cell` }>
								<input type="text" value={ this.state.padding.paddingBottom }
									onChange={ event => onChangeValuePadding( { paddingBottom: event.target.value } ) }
									onBlur={ setUnitsToPadding }
									placeholder="-"
								/>
							</div>
							<div className={ `${ rootClassName }__item8 ${ rootClassName }__cell` }>
								<input type="text" value={ this.state.margin.marginBottom }
									onChange={ event => onChangeValueMargin( { marginBottom: event.target.value } ) }
									onBlur={ setUnitsToMargin }
									placeholder="-"
								/>
							</div>
							<div className={ `${ rootClassName }__content ${ rootClassName }__cell` }></div>
						</div>
					) : (
						<Fragment />
					)
				}
			</Fragment>
		);
	}
}

PaddingMarginControl.defaultProps = {
	label: __( 'Margin and Padding', 'wpv-views' ),
	margin: PropTypes.shape( {
		enabled: false,
		marginTop: null,
		marginLeft: null,
		marginRight: null,
		marginBottom: null,
	} ),
	padding: PropTypes.shape( {
		enabled: false,
		paddingTop: null,
		paddingLeft: null,
		paddingRight: null,
		paddingBottom: null,
	} ),
};

PaddingMarginControl.propTypes = {
	label: PropTypes.string,
	margin: PropTypes.shape( {
		enabled: PropTypes.bool,
		marginTop: PropTypes.string,
		marginLeft: PropTypes.string,
		marginRight: PropTypes.string,
		marginBottom: PropTypes.string,
	} ),
	padding: PropTypes.shape( {
		enabled: PropTypes.bool,
		paddingTop: PropTypes.string,
		paddingLeft: PropTypes.string,
		paddingRight: PropTypes.string,
		paddingBottom: PropTypes.string,
	} ),
	onChangeMargin: PropTypes.func.isRequired,
	onChangePadding: PropTypes.func.isRequired,
};

export default PaddingMarginControl;
