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
				label={ __( 'Line Height', 'wpv-views' ) }
				help={ help && help.lineHeight ? help.lineHeight : null }
			>
				<div className="tb-row-block">
					<NumberField
						label=""
						min={ 0 }
						value={ data.lineHeight || null }
						unit={ data.lineHeightUnit }
						onChange={ ( lineHeight, lineHeightUnit ) => setAttributes( {
							lineHeight: toNumber( lineHeight ),
							lineHeightUnit,
						} ) }
						units={ [ 'px', 'em', 'rem' ] }
					/>
					<Button
						type="button"
						disabled={ ! data.lineHeight }
						onClick={ () => setAttributes( { lineHeight: undefined, lineHeightUnit: 'px' } ) }
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
