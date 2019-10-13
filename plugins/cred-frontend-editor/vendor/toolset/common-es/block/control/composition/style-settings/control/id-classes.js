// External Dependencies
import { uniq, difference } from 'lodash';

// WordPress Dependencies
import { Component, Fragment } from '@wordpress/element';
import { TextControl, FormTokenField } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { compose } from '@wordpress/compose';
import { withDispatch, withSelect } from '@wordpress/data';

// Internal Dependencies
import { name as storeName } from '../store';
import { stringToCssClass } from '../../../../../utils';

class IdClasses extends Component {
	render() {
		const { data, setAttributes } = this.props;

		const attributesClasses = typeof data.cssClasses === 'string' ?
			data.cssClasses.split( ' ' ) :
			data.cssClasses;

		const currentCssClasses = attributesClasses || [];

		return (
			<Fragment>
				<TextControl
					label={ __( 'ID', 'wpv-views' ) }
					value={ data.id }
					onChange={ id => setAttributes( { id } ) }
				/>
				<div className="tces-classes">
					<FormTokenField
						label={ __( 'CSS Classes', 'wpv-views' ) }
						tokenizeOnSpace={ true }
						value={ currentCssClasses }
						suggestions={ difference( this.props.alreadyUsedClasses, currentCssClasses ) }
						onChange={ cssClasses => {
							if ( ! Array.isArray( cssClasses ) ) {
								setAttributes( { cssClasses: [] } );
							}

							cssClasses = cssClasses.map( cssClass => stringToCssClass( cssClass ) );
							cssClasses = uniq( cssClasses );
							setAttributes( { cssClasses } );
							this.props.addCssClass( cssClasses );
						} }
					/>
				</div>

				<p className="components-base-control__help">
					{ __( 'Separate with commas, spaces, or the Enter key.', 'wpv-views' ) }
				</p>
			</Fragment>
		);
	}
}

const IdClassesComposed = compose( [
	withSelect( ( select ) => {
		const { getClasses } = select( storeName );
		return {
			alreadyUsedClasses: getClasses(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const { addCssClass } = dispatch( storeName );
		return {
			addCssClass( cssClass ) {
				addCssClass( cssClass );
			},
		};
	} ),
] )( IdClasses );

export default IdClassesComposed;
