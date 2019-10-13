// External Dependencies
import classNames from 'classnames';
import PropTypes from 'prop-types';

// WordPress Dependencies
import { Component } from '@wordpress/element';
import { ButtonGroup, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { withInstanceId } from '@wordpress/compose';

// Internal Dependencies
import './scss/edit.scss';

/**
 * Control with a number input and optional units
 */
class Number extends Component {
	constructor() {
		super( ...arguments );
		this.renderButton = this.renderButton.bind( this );
	}

	renderButton( item ) {
		const { onChange, value, unit } = this.props;
		return (
			<Button
				key={ item }
				isSmall
				isPrimary={ item === unit }
				aria-pressed={ item === unit }
				onClick={ () => onChange( value, item ) }
			>
				{ item }
			</Button>
		);
	}

	render() {
		const { value, label, min, max, onChange, unit, layoutInline, layoutShowUnits, units, disabled, instanceId } = this.props;

		const showUnitsAsSelect = units.length > 0 && layoutInline && layoutShowUnits;
		const showUnitsAsButtons = units.length > 0 && ! layoutInline && layoutShowUnits;

		const controlClassNames = classNames(
			'tb-control-number',
			{
				'tb-no-unit-inputs': ! layoutShowUnits || ( ! showUnitsAsSelect && ! showUnitsAsButtons ),
				'tb-units-as-select': showUnitsAsSelect,
				'tb-units-as-buttons': showUnitsAsButtons,
			}
		);

		return (
			<div className={ controlClassNames }>
				{ label && (
					<label htmlFor={ `tb-control-number-input-${ instanceId }` } id={ `tb-control-number-label-${ instanceId }` } className="tb-control-label">{ label }</label>
				) }
				<div>
					<input
						id={ `tb-control-number-input-${ instanceId }` }
						type="number"
						value={ !! value ? value : '' }
						min={ min }
						max={ max }
						disabled={ disabled }
						onChange={ ( e ) => onChange( e.target.value, unit ) }
					/>

					{ showUnitsAsSelect &&
					<select
						id={ `tb-control-number-select-${ instanceId }` }
						onChange={ ( e ) => onChange( value, e.target.value ) }
						value={ unit }
						disabled={ disabled }
					>
						{ units.map( ( item, index ) =>
							<option
								key={ `${ item }-${ index }` }
								value={ item }
							>
								{ item }
							</option>
						) }
					</select>
					}

					{ showUnitsAsButtons &&
					<div className="tb-align-right">
						<ButtonGroup aria-label={ this.props.label }>
							{ units.map( this.renderButton ) }
						</ButtonGroup>
					</div>
					}
				</div>
			</div>
		);
	}
}

Number.defaultProps = {
	label: __( 'Number', 'wpv-views' ),
	value: null,
	min: null,
	max: null,
	unit: 'px',
	units: [],
	disabled: false,
	layoutInline: true,
	layoutShowUnits: true,
};

Number.propTypes = {
	label: PropTypes.string,
	value: PropTypes.number,
	min: PropTypes.number,
	max: PropTypes.number,
	unit: PropTypes.string,
	units: PropTypes.array,
	disabled: PropTypes.bool,
	onChange: PropTypes.func.isRequired,
};

export default withInstanceId( Number );
