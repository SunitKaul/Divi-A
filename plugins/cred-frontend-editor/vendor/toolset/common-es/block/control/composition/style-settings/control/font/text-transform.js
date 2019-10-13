// Internal dependencies
import { BaseControl, Button, ButtonGroup } from '@wordpress/components';
import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export default class extends Component {
	render() {
		const { data, setAttributes } = this.props;

		const textTransform = data.textTransform || undefined;

		return (
			<BaseControl label={ __( 'Text Transform', 'wpv-views' ) }>
				<ButtonGroup>
					<Button isSmall isPrimary={ textTransform === 'capitalize' }
						onClick={ () => {
							const updated = textTransform === 'capitalize' ?
								undefined :
								'capitalize';

							setAttributes( { textTransform: updated } );
						} }>
						{ __( 'Capitalize', 'wpv-views' ) }
					</Button>

					<Button isSmall isPrimary={ textTransform === 'uppercase' }
						onClick={ () => {
							const updated = textTransform === 'uppercase' ?
								undefined :
								'uppercase';

							setAttributes( { textTransform: updated } );
						} }>
						{ __( 'Uppercase', 'wpv-views' ) }
					</Button>

					<Button isSmall isPrimary={ textTransform === 'lowercase' }
						onClick={ () => {
							const updated = textTransform === 'lowercase' ?
								undefined :
								'lowercase';

							setAttributes( { textTransform: updated } );
						} }>
						{ __( 'Lowercase', 'wpv-views' ) }
					</Button>
				</ButtonGroup>
			</BaseControl>
		);
	}
}
