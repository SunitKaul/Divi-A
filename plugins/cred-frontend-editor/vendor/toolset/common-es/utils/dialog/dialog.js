/* External Dependencies */
import { Button, Modal } from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { withSelect, withDispatch } from '@wordpress/data';
import { Fragment, render, unmountComponentAtNode } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

// Store
import './store';

// Constants
export const DialogModal = compose(
	withSelect( ( select, { dialogId } ) => {
		const { isDialogEnabled } = select( 'toolset/dialogs' );
		return {
			isVisible: isDialogEnabled( dialogId ),
		};
	} ),
	withDispatch( ( dispatch, { dialogId } ) => {
		const { disableDialog } = dispatch( 'toolset/dialogs' );
		return {
			disableDialog() {
				disableDialog( dialogId );
			},
		};
	} ),
)( ( { isVisible, title, children, buttons, isDismissable = true, isDisableable = false, disableDialog } ) => {
	if ( ! isVisible ) {
		return null;
	}

	return (
		<Fragment>
			<Modal title={ title }
				onRequestClose={ () => dialogRemove() }
				isDismissable={ isDismissable }
			>
				<div className="tb-dialog">
					{ children }

					{ isDisableable &&
						<label htmlFor="tb-dialog-disable">
							<input id="tb-dialog-disable" type="checkbox" />
							{ __( 'Do not display this message again.', 'wpv-views' ) }
						</label>
					}

					{ buttons.length &&
						<div className="editor-post-locked-modal__buttons">
							{ buttons.map( ( button, i ) => (
								<Button
									isPrimary={ !! button.isPrimary }
									isDefault={ ! button.isPrimary }
									key={ i }
									onClick={ () => {
										if ( isDisableable ) {
											const userCheckbox = document.getElementById( 'tb-dialog-disable' );
											if ( userCheckbox && userCheckbox.checked ) {
												disableDialog();
											}
										}
										dialogRemove();
										button.onClick();
									} }>
									{ button.label }
								</Button>
							) ) }
						</div>
					}
				</div>
			</Modal>
		</Fragment>
	);
} );

/* Dialog */
export function dialog( props ) {
	if ( ! document.getElementById( 'tb-dialog-container' ) ) {
		document.body.insertAdjacentHTML(
			'beforeend',
			'<div id="' + 'tb-dialog-container' + '"></div>' );
	}

	render( <DialogModal { ...props }>{ props.content() }</DialogModal>, document.getElementById( 'tb-dialog-container' ) );
}

/* Remove Dialog */
function dialogRemove() {
	const dialogElement = document.getElementById( 'tb-dialog-container' );

	if ( dialogElement ) {
		unmountComponentAtNode( dialogElement );
		dialogElement.parentNode.removeChild( dialogElement );
	}
}

