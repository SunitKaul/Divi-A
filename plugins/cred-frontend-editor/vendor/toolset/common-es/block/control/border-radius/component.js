// External Dependencies
import PropTypes from 'prop-types';
// WordPress Dependencies
import { Component, Fragment } from '@wordpress/element';
import { Button, Dashicon, TextControl, PanelRow } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
// Internal Dependencies
import './scss/edit.scss';
import { withInstanceId } from '@wordpress/compose';
import { getNumberOr } from '../../../utils';

/**
 * Border Radius
 *
 * This control offers 4-inputs for each corner and a Icon to toggle between
 * linking all values.
 *
 * <BorderRadius
 *  label={string} (default: __( 'Border Radius', 'wpv-views' ) )
 * 	borderRadius={object BorderRadius.propTypes.borderRadius }
 * 	onChange={callable (
 * 		{string} value,
 * 		{string} editedCorner,
 * 		{bool} linkedBorderRadius
 * 		) }
 * 	/>
 *
 * All attributes without default value are required.
 */
class BorderRadius extends Component {
	constructor() {
		super( ...arguments );

		this.renderCornerInputs = this.renderCornerInputs.bind( this );

		const { borderRadius, disabled } = this.props;

		const activeUniqueBorderEdges = [];

		[ 'topLeft', 'topRight', 'bottomLeft', 'bottomRight' ].map( ( keyCorner ) => {
			if ( ! disabled[ keyCorner ] && ! activeUniqueBorderEdges.includes( borderRadius[ keyCorner ] ) ) {
				activeUniqueBorderEdges.push( borderRadius[ keyCorner ] );
			}
		} );

		this.state = {
			linkBorderRadius: activeUniqueBorderEdges.length === 1,
		};

		if ( ! document.getElementById( 'tb-border-radius-tooltip' ) ) {
			document.body.insertAdjacentHTML(
				'beforeend',
				'<div id="tb-border-radius-tooltip" class="tb-tooltip tb-tooltip-at-cursor">' +
				__( 'No Drag & Drop available. Use Cut & Paste instead.', 'wpv-views' ) +
				'</div>' );
		}

		this.tooltip = document.getElementById( 'tb-border-radius-tooltip' );
	}

	renderCornerInputs() {
		const { borderRadius, onChange, disabled } = this.props;
		const { linkBorderRadius } = this.state;

		// `borderRadius` properties have to be sorted because depending on the order of the properties when object is defined,
		// the inputs will be misplaced. The position of the input will not match with control corner
		// Another solution is to place the inputs using CSS grid templates
		const sorting = {
			topLeft: 1,
			topRight: 2,
			bottomRight: 3,
			bottomLeft: 4,
		};

		return Object.keys( borderRadius ).sort( ( a, b ) => sorting[ a ] > sorting[ b ] ).map( ( corner ) => {
			if ( disabled[ corner ] ) {
				return (
					/* eslint-disable */
					<TextControl
						type="number"
						onMouseOver={ () => {
							this.tooltip.innerHTML = disabled[ corner ];
							this.tooltip.classList.add( 'tb-tooltip-active' );
						} }
						onMouseMove={ ( event ) => {
							this.tooltip.style.top = ( event.clientY - this.tooltip.offsetHeight - 10 ) + 'px';
							this.tooltip.style.left = ( event.clientX - ( this.tooltip.offsetWidth / 2 ) ) + 'px';
						} }
						onMouseOut={ () => {
							this.tooltip.classList.remove( 'tb-tooltip-active' );
						} }
						value={ getNumberOr( borderRadius[ corner ] ) }
						className="tb-input-disabled"
					/>
					/* eslint-enable */
				);
			}
			return (
				<TextControl
					type="number"
					placeholder="-"
					key={ corner }
					value={ getNumberOr( borderRadius[ corner ] ) }
					min={ 0 }
					onChange={ ( val ) => onChange( val, corner, linkBorderRadius ) }
					className={ `tb-input-border-radius-${ corner.toLowerCase() }` }
				/>
			);
		} );
	}

	render() {
		const { instanceId, label } = this.props;
		return (
			<Fragment>
				<PanelRow>
					<label htmlFor={ `tb-border-radius-${ instanceId }` }>
						{ label }
					</label>
					<Button id={ `tb-border-radius-${ instanceId }` } className="tb-no-outline tb-no-padding tb-link-button"
						onClick={ () => this.setState( { linkBorderRadius: ! this.state.linkBorderRadius } ) }
					>
						<Dashicon icon={ this.state.linkBorderRadius ? 'admin-links' : 'editor-unlink' } />
					</Button>
				</PanelRow>
				<div className="tb-border-radius">
					{ this.renderCornerInputs() }
				</div>
			</Fragment>
		);
	}
}

// Defaults
BorderRadius.defaultProps = {
	label: __( 'Border Radius', 'wpv-views' ),
	disabled: {},
	borderRadius: {
		topRight: '',
		topLeft: '',
		bottomRight: '',
		bottomLeft: '',
	},
};

// Attributes schema
BorderRadius.propTypes = {
	borderRadius: PropTypes.shape( {
		topRight: PropTypes.number,
		topLeft: PropTypes.number,
		bottomRight: PropTypes.number,
		bottomLeft: PropTypes.number,
	} ),

	onChange: PropTypes.func.isRequired,
};

export default withInstanceId( BorderRadius );
