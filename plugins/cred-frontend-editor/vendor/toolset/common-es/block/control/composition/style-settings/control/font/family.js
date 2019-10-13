// External Dependencies
import Select from 'react-select';
import { findIndex } from 'lodash';

// WordPress Dependencies
import { Component, Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { BaseControl, Button } from '@wordpress/components';

// Internal Dependencies
import googleFontsJson from './google-fonts.json';

export default class extends Component {
	fontsAsSelectOptions() {
		return googleFontsJson.items.map( ( font ) => {
			return {
				value: font.family,
				label: font.family,
			};
		} );
	}

	fontVariantAsSelectOptions( font ) {
		if ( ! font ) {
			return null;
		}

		const fontIndex = findIndex( googleFontsJson.items, { family: font } );
		if ( ! fontIndex ) {
			return null;
		}

		const variants = googleFontsJson.items[ fontIndex ].variants
			.filter( variant => ! variant.includes( 'italic' ) )
			.map( variant => {
				return { value: variant, label: variant };
			} );

		return !! variants ? variants : null;
	}

	render() {
		const { data, setAttributes } = this.props;

		const fontVariants = this.fontVariantAsSelectOptions( data.font );
		const fontHasVariant = data.fontVariant && findIndex( fontVariants, { value: data.fontVariant } ) >= 0;

		return (
			<Fragment>
				<BaseControl label={ __( 'Font', 'wpv-views' ) } >
					<div className="tb-row-block">
						<div style={ { width: '100%' } }>
							<Select
								value={ data.font ? { value: data.font, label: data.font } : null }
								options={ this.fontsAsSelectOptions() }
								onChange={ font => setAttributes( { font: font.value } ) }
							/>
						</div>

						<Button
							type="button"
							disabled={ ! data.font }
							onClick={ () => setAttributes( { font: undefined } ) }
							isDefault
							isSmall
						>
							{ __( 'Reset', 'wpv-views' ) }
						</Button>
					</div>
				</BaseControl>
				{ fontVariants &&
					<BaseControl label={ __( 'Font Weight', 'wpv-views' ) } >
						<Select
							value={ data.fontVariant && fontHasVariant ?
								{ value: data.fontVariant, label: data.fontVariant } :
								{ value: 'regular', label: 'regular' } }
							options={ fontVariants || [ { value: 'regular', label: 'regular' } ] }
							onChange={ variant => setAttributes( { fontVariant: variant.value } ) }
						/>
					</BaseControl>
				}
			</Fragment>
		);
	}
}
