// WordPress Dependencies
import { Component, Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { MediaUpload } from '@wordpress/editor';
import { BaseControl, Button, ButtonGroup, PanelRow, ToggleControl } from '@wordpress/components';

// Internal Dependencies
import { ColorPicker, Number } from '../../../../../index';

export class Image extends Component {
	setSize( size ) {
		this.props.setBackground( { image: { size } } );
	}

	setHorizontal( position ) {
		this.props.setBackground( { image: { horizontal: { position } } } );
	}

	setVertical( position ) {
		this.props.setBackground( { image: { vertical: { position } } } );
	}

	setHorizontalCustom( valueRaw, unit ) {
		const value = !! valueRaw ? parseInt( valueRaw, 10 ) : undefined;
		this.props.setBackground( { image: { horizontal: { value, unit } } } );
	}

	setVerticalCustom( valueRaw, unit ) {
		const value = !! valueRaw ? parseInt( valueRaw, 10 ) : undefined;
		this.props.setBackground( { image: { vertical: { value, unit } } } );
	}

	setRepeat( repeat ) {
		this.props.setBackground( { image: { repeat } } );
	}

	render() {
		const { background, setBackground } = this.props;
		const { dynamicBackgroundImageKey, dynamicFieldControlRender, dynamicFieldGet, attributes } = this.props.passThrough;
		const backgroundImage = background.image.url || '';

		const size = background.image.size || 'cover';
		const positionHorizontal = background.image.horizontal.position || 'center';
		const positionVertical = background.image.vertical.position || 'center';
		const repeat = background.image.repeat || 'no-repeat';
		const dynamicIsActive = dynamicFieldGet( dynamicBackgroundImageKey ).isActive;

		return (
			<Fragment>
				{ dynamicIsActive &&
				<img style={ { padding: '0 0 15px 0', fontStyle: 'italic' } } src={ attributes[ dynamicBackgroundImageKey ] } alt={ __( 'The selected source does not provide any image data.', 'wpv-views' ) } />
				}
				{ ! dynamicIsActive && !! backgroundImage &&
				<img style={ { padding: '0 0 15px 0' } } src={ backgroundImage } alt={ __( 'Preview of Background Image', 'wpv-views' ) } />
				}

				{ dynamicFieldControlRender( dynamicBackgroundImageKey ) }

				{ ! dynamicIsActive &&
					<BaseControl className="tces-image-select">
						<MediaUpload
							title={ __( 'Select Background Image', 'wpv-views' ) }
							onSelect={ ( { url } ) => setBackground( { image: { url } } ) }
							allowedTypes={ [ 'image' ] }
							render={ ( { open } ) => (
								<Button
									isDefault
									onClick={ open }
								>
									{ ! backgroundImage ?
										__( 'Select Background Image', 'wpv-views' ) :
										__( 'Replace Background Image', 'wpv-views' ) }
								</Button>
							) }
						/>
						{ !! backgroundImage &&
						<Button onClick={ () => setBackground( { image: { url: undefined } } ) } isLink isDestructive>
							{ __( 'Remove Background Image', 'wpv-views' ) }
						</Button>
						}
					</BaseControl>
				}

				<BaseControl label={ __( 'Size', 'wpv-views' ) } >
					<PanelRow>
						<ButtonGroup>
							<Button isSmall isPrimary={ size === 'auto' }
								onClick={ () => this.setSize( 'auto' ) }>
								{ __( 'Auto', 'wpv-views' ) }
							</Button>
							<Button isSmall isPrimary={ size === 'cover' }
								onClick={ () => this.setSize( 'cover' ) }>
								{ __( 'Cover', 'wpv-views' ) }
							</Button>
							<Button isSmall isPrimary={ size === 'contain' }
								onClick={ () => this.setSize( 'contain' ) }>
								{ __( 'Contain', 'wpv-views' ) }
							</Button>
							<Button isSmall isPrimary={ size === 'custom' }
								onClick={ () => this.setSize( 'custom' ) }>
								{ __( 'Custom', 'wpv-views' ) }
							</Button>
						</ButtonGroup>
					</PanelRow>

					{ size === 'custom' &&
					<div className="tces-row">
						<div>
							<Number
								label={ __( 'Width', 'wpv-views' ) }
								value={ background.image.width || undefined }
								unit={ background.image.widthUnit || 'px' }
								units={ [ 'px', '%' ] }
								onChange={ ( width, widthUnit ) => setBackground( { image: { width: !! width ? parseInt( width, 10 ) : undefined, widthUnit } } ) }
							/>
						</div>
						<div>
							<Number
								label={ __( 'Height', 'wpv-views' ) }
								value={ background.image.height || undefined }
								unit={ background.image.heightUnit || 'px' }
								units={ [ 'px', '%' ] }
								onChange={ ( height, heightUnit ) => setBackground( { image: { height: !! height ? parseInt( height, 10 ) : undefined, heightUnit } } ) }
							/>
						</div>
					</div>
					}
				</BaseControl>

				<BaseControl label={ __( 'Position Horizontal', 'wpv-views' ) } >
					<PanelRow>
						<ButtonGroup>
							<Button isSmall isPrimary={ positionHorizontal === 'left' }
								onClick={ () => this.setHorizontal( 'left' ) }>
								{ __( 'Left', 'wpv-views' ) }
							</Button>
							<Button isSmall isPrimary={ positionHorizontal === 'center' }
								onClick={ () => this.setHorizontal( 'center' ) }>
								{ __( 'Center', 'wpv-views' ) }
							</Button>
							<Button isSmall isPrimary={ positionHorizontal === 'right' }
								onClick={ () => this.setHorizontal( 'right' ) }>
								{ __( 'Right', 'wpv-views' ) }
							</Button>
							<Button isSmall isPrimary={ positionHorizontal === 'custom' }
								onClick={ () => this.setHorizontal( 'custom' ) }>
								{ __( 'Custom', 'wpv-views' ) }
							</Button>
						</ButtonGroup>
					</PanelRow>

					{ positionHorizontal === 'custom' &&
					<div className="tces-row">
						<Number
							label={ null }
							value={ background.image.horizontal.value || undefined }
							unit={ background.image.horizontal.unit || 'px' }
							units={ [ 'px', '%' ] }
							onChange={ ( value, unit ) => this.setHorizontalCustom( value, unit ) }
						/>
					</div>
					}
				</BaseControl>

				{ background.image.attachment !== 'fixed' &&
				<BaseControl label={ __( 'Position Vertical', 'wpv-views' ) } >
					<PanelRow>
						<ButtonGroup>
							<Button isSmall isPrimary={ positionVertical === 'top' }
								onClick={ () => this.setVertical( 'top' ) }>
								{ __( 'Top', 'wpv-views' ) }
							</Button>
							<Button isSmall isPrimary={ positionVertical === 'center' }
								onClick={ () => this.setVertical( 'center' ) }>
								{ __( 'Center', 'wpv-views' ) }
							</Button>
							<Button isSmall isPrimary={ positionVertical === 'bottom' }
								onClick={ () => this.setVertical( 'bottom' ) }>
								{ __( 'Bottom', 'wpv-views' ) }
							</Button>
							<Button isSmall isPrimary={ positionVertical === 'custom' }
								onClick={ () => this.setVertical( 'custom' ) }>
								{ __( 'Custom', 'wpv-views' ) }
							</Button>
						</ButtonGroup>
					</PanelRow>

					{ positionVertical === 'custom' &&
					<div className="tces-row">
						<Number
							label={ null }
							value={ background.image.vertical.value || undefined }
							unit={ background.image.vertical.unit || 'px' }
							units={ [ 'px', '%' ] }
							onChange={ ( value, unit ) => this.setVerticalCustom( value, unit ) }
						/>
					</div>
					}
				</BaseControl>
				}
				<BaseControl label={ __( 'Repeat', 'wpv-views' ) } >
					<PanelRow>
						<ButtonGroup>
							<Button isSmall isPrimary={ repeat === 'repeat' }
								onClick={ () => this.setRepeat( 'repeat' ) }>
								{ __( 'Repeat', 'wpv-views' ) }
							</Button>
							<Button isSmall isPrimary={ repeat === 'no-repeat' }
								onClick={ () => this.setRepeat( 'no-repeat' ) }>
								{ __( 'No Repeat', 'wpv-views' ) }
							</Button>
							<Button isSmall isPrimary={ repeat === 'repeat-x' }
								onClick={ () => this.setRepeat( 'repeat-x' ) }>
								{ __( 'X', 'wpv-views' ) }
							</Button>
							<Button isSmall isPrimary={ repeat === 'repeat-y' }
								onClick={ () => this.setRepeat( 'repeat-y' ) }>
								{ __( 'Y', 'wpv-views' ) }
							</Button>
						</ButtonGroup>
					</PanelRow>
				</BaseControl>

				<BaseControl>
					<PanelRow>
						<span className="tb-control-color-picker-label">
							{ __( 'Overlay Color', 'wpv-views' ) }
						</span>
						<ColorPicker
							color={ background.image.overlayColor || { rgb: { r: 0, g: 0, b: 0, a: 0 } } }
							onChange={ value => setBackground( { image: { overlayColor: { rgb: value.rgb } } } ) }
						/>
					</PanelRow>
				</BaseControl>

				<BaseControl help={ __( 'The color lays behind the image. It\'s not visible, when the image covers the complete area and has no transparent parts.', 'wpv-views' ) }>
					<PanelRow>
						<span className="tb-control-color-picker-label">
							{ __( 'Background Color', 'wpv-views' ) }
						</span>
						<ColorPicker
							color={ background.image.color || { rgb: { r: 0, g: 0, b: 0, a: 0 } } }
							onChange={ value => setBackground( { image: { color: { rgb: value.rgb } } } ) }
						/>
					</PanelRow>
				</BaseControl>

				<BaseControl
					help={ __( 'This will disable the Position Vertical option.', 'wpv-views' ) }
				>
					<PanelRow>
						<ToggleControl
							label={ __( 'Fixed Position (Parallax)', 'wpv-views' ) }
							checked={ background.image.attachment === 'fixed' }
							onChange={ () => setBackground( { image: { attachment: background.image.attachment === 'fixed' ? false : 'fixed' } } ) }
						/>
					</PanelRow>
				</BaseControl>

			</Fragment>

		);
	}
}
