import { toNumber } from 'lodash';

import { BaseControl, Button } from '@wordpress/components';
import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Number as NumberField } from '../../../../index';

export default class extends Component {
	render() {
		const { data, setAttributes, help } = this.props;

		return (
			<BaseControl
				label={ __( 'Letter Spacing', 'wpv-views' ) }
				help={ help && help.letterSpacing ? help.letterSpacing : null }
			>
				<div className="tb-row-block">
					<NumberField
						label=""
						min={ 0 }
						value={ data.letterSpacing || null }
						unit={ data.letterSpacingUnit }
						onChange={ ( value, unit ) => setAttributes( {
							letterSpacing: toNumber( value ),
							letterSpacingUnit: unit,
						} ) }
						units={ [ 'px', 'em', 'rem' ] }
					/>
					<Button
						type="button"
						disabled={ ! data.letterSpacing }
						onClick={ () => setAttributes( { letterSpacing: undefined, letterSpacingUnit: 'px' } ) }
						isDefault
						isSmall
					>
						{ __( 'Reset', 'wpv-views' ) }
					</Button>
				</div>
			</BaseControl>
		);
	}
}
