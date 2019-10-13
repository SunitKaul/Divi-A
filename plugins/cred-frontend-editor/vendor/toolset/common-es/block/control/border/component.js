// External Dependencies
import PropTypes from 'prop-types';
import { upperFirst } from 'lodash';

// WordPress Dependencies
import { Component, Fragment } from '@wordpress/element';
import { Button, Dashicon, PanelRow } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { withInstanceId } from '@wordpress/compose';

// Internal Dependencies
import './scss/edit.scss';
import Number from '../number/component';
import ColorPicker from '../color-picker/component';
import isLinked from './utils/isLinked';

const BORDER_STYLES = [ 'solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset' ];

/**
 * Control with a number input and optional units
 */
class Border extends Component {
	constructor() {
		super( ...arguments );

		const { border } = this.props;

		this.toggleLinked = this.toggleLinked.bind( this );
		this.changeBorder = this.changeBorder.bind( this );
		this.renderInputBorder = this.renderInputBorder.bind( this );

		this.state = {
			linkBorder: isLinked( border ),
		};
	}

	toggleLinked() {
		this.setState( { linkBorder: ! this.state.linkBorder } );
		const newBorder = Object.assign( {},
			{ ...this.props.border },
			{
				right: { ...this.props.border.top },
				bottom: { ...this.props.border.top },
				left: { ...this.props.border.top },
			}
		);

		this.props.onChange( newBorder );
	}

	changeBorder( key, val, side, unit ) {
		let newBorder = Object.assign( {}, { ...this.props.border } );
		const sides = side === 'all' ? [ 'top', 'right', 'bottom', 'left' ] : [ side ];

		sides.forEach( ( borderSide ) => {
			if ( key === 'width' ) {
				// string to float: rem and em units allows floats
				val = parseFloat( val );
				// also update widthUnit
				newBorder = Object.assign( {},
					{ ...newBorder },
					{ [ borderSide ]: { ...newBorder[ borderSide ], widthUnit: unit } }
				);
			}
			// for some odd reason "newBorder[borderSide][key] = val" SOMETIMES overrides ALL sides
			// that's why we need to recreate the object with the new values.
			newBorder = Object.assign( {},
				{ ...newBorder },
				{ [ borderSide ]: { ...newBorder[ borderSide ], [ key ]: val } }
			);
		} );

		this.props.onChange( newBorder );
	}

	renderInputs() {
		const self = this;
		if ( this.state.linkBorder ) {
			return this.renderInputBorder();
		}

		const returnInputs = [];
		Object.keys( this.props.border ).forEach( function( border, index ) {
			returnInputs.push( self.renderInputBorder( border, index ) );
		} );

		return returnInputs;
	}

	renderInputBorder( borderSide = 'all', index = 0 ) {
		const { border } = this.props;

		const activeBorderSide = borderSide === 'all' ? border.top : border[ borderSide ];
		const { width, widthUnit, style, color } = activeBorderSide;

		const styles = {
			boxSizing: 'border-box',
			width: '28px',
			height: '28px',
			margin: '1px 0 0',
			backgroundColor: '#f6f6f6',
			border: '1px dashed #ccc',
		};

		switch ( borderSide ) {
			case 'all':
				styles.border = '3px solid #666';
				break;
			default:
				styles[ 'border' + upperFirst( borderSide ) ] = '3px solid #666';
		}

		return (
			<div key={ `tb-control-border-row-${ this.props.instanceId }-${ index }` } className="tb-control-border tb-row-block">
				<div key={ `tb-control-border-indicator-${ this.props.instanceId }-${ index }` } style={ styles }>{ /* Border Indicator */ }</div>
				<Number
					label=""
					min={ 0 }
					value={ width }
					unit={ widthUnit }
					onChange={ ( val, unit ) => this.changeBorder( 'width', val, borderSide, unit ) }
					units={ [ 'px', 'em', 'rem' ] }
				/>
				<select
					id={ `tb-control-number-select-${ this.props.instanceId }-${ index }` }
					value={ style }
					onChange={ ( e ) => this.changeBorder( 'style', e.target.value, borderSide ) }
				>
					{ BORDER_STYLES.map( ( item, i ) =>
						<option
							key={ `${ item }-${ i }` }
							value={ item }
						>
							{ item }
						</option>
					) }
				</select>
				<ColorPicker
					color={ color }
					onChange={ ( val ) => this.changeBorder( 'color', val, borderSide ) }
				/>
			</div>
		);
	}

	render() {
		const { instanceId, label } = this.props;

		return (
			<Fragment>
				<PanelRow>
					<label htmlFor={ `tb-border-${ instanceId }` }>
						{ label }
					</label>
					<Button id={ `tb-border-${ instanceId }` } className="tb-no-outline tb-no-padding tb-link-button"
						onClick={ this.toggleLinked }
					>
						<Dashicon icon={ this.state.linkBorder ? 'admin-links' : 'editor-unlink' } />
					</Button>
				</PanelRow>
				{ this.renderInputs() }
			</Fragment>
		);
	}
}

const DEFAULT_BORDER = {
	style: 'solid',
	width: null,
	widthUnit: 'px',
	color: { hex: '#000000', rgb: { r: 0, g: 0, b: 0, a: 1 } },
};

Border.defaultProps = {
	label: __( 'Border', 'wpv-views' ),
	border: {
		top: DEFAULT_BORDER,
		right: DEFAULT_BORDER,
		bottom: DEFAULT_BORDER,
		left: DEFAULT_BORDER,
	},
};

Border.propTypes = {
	border: PropTypes.object,
	onChange: PropTypes.func.isRequired,
};

export default withInstanceId( Border );
