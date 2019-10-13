// WordPress Dependencies
import { Button, ButtonGroup, PanelRow, RangeControl } from '@wordpress/components';
import { Component, Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

// Internal Dependencies
import { ColorPicker } from '../../../../../index';
import { deepCloneObject } from '../../../../../../../utils';

export class Gradient extends Component {
	constructor() {
		super( ...arguments );

		this.addColor = this.addColor.bind( this );

		this.colors = [];
	}

	setColors() {
		this.props.setBackground( { gradient: { colors: this.colors } } );
	}

	addColor() {
		this.colors.push( { rgb: { r: 0, g: 0, b: 0, a: 1 } } );
		this.setColors();
	}

	removeColor( index ) {
		this.colors.splice( index, 1 );
		this.setColors();
	}

	setColor( value, index ) {
		this.colors[ index ].rgb = value.rgb;
		this.setColors();
	}

	setColorStop( value, index ) {
		this.colors[ index ].stop = value;
		this.setColors();
	}

	render() {
		const { background, setBackground } = this.props;

		const cloneBackground = deepCloneObject( background );
		this.colors = cloneBackground.gradient.colors || [];

		const isLinear = ! background.gradient.type || background.gradient.type === 'linear';
		const isEllipse = ! background.gradient.form || background.gradient.form === 'ellipse';

		while ( this.colors.length < 2 ) {
			this.colors.push( { rgb: { r: 0, g: 0, b: 0, a: 1 } } );
		}

		return (
			<Fragment>
				<ButtonGroup className="tces-control-background-gradient-type">
					<Button isSmall isPrimary={ isLinear }
						onClick={ () => setBackground( { gradient: { type: 'linear' } } ) }>
						{ __( 'Linear', 'wpv-views' ) }
					</Button>
					<Button isSmall isPrimary={ ! isLinear }
						onClick={ () => setBackground( { gradient: { type: 'radial' } } ) }>
						{ __( 'Radial', 'wpv-views' ) }
					</Button>
				</ButtonGroup>
				{ isLinear &&
				<div className="tces-row-fixed-height">
					<span>
						{ __( 'Angle', 'wpv-views' ) }
					</span>
					<RangeControl
						value={ background.gradient.angle || '' }
						onChange={ angle => setBackground( { gradient: { angle } } ) }
						min={ -360 }
						max={ 360 }
					/>
				</div>
				}

				{ ! isLinear &&
				<PanelRow className="tces-row-fixed-height">
					<span>
						{ __( 'Form', 'wpv-views' ) }
					</span>
					<ButtonGroup>
						<Button isSmall isPrimary={ isEllipse }
							onClick={ () => setBackground( { gradient: { form: 'ellipse' } } ) }>
							{ __( 'Ellipse', 'wpv-views' ) }
						</Button>
						<Button isSmall isPrimary={ ! isEllipse }
							onClick={ () => setBackground( { gradient: { form: 'circle' } } ) }>
							{ __( 'Circle', 'wpv-views' ) }
						</Button>
					</ButtonGroup>
				</PanelRow>
				}

				<span>
					{ __( 'Repeating Range in %', 'wpv-views' ) }
				</span>
				<RangeControl
					value={ background.gradient.repeating || '' }
					onChange={ repeating => setBackground( { gradient: { repeating } } ) }
					min={ 0 }
					max={ 100 }
					help={ __( 'Leave empty for no repeating.', 'wpv-views' ) }
				/>

				{ this.colors.map( ( color, i ) => {
					const rangeHelp = i === 0 ?
						{ help: __( 'Color stop position in %. Leave empty to spread color automatically.', 'wpv-views' ) } :
						{};

					const disableLastStopBecauseOfRepeating = i === this.colors.length - 1 && background.gradient.repeating;

					return (
						<Fragment key={ `background-color-${ i }` }>
							<PanelRow>
								<span className="tb-control-color-picker-label">
									{ __( 'Color', 'wpv-views' ) + ' ' + ( i + 1 ) }
								</span>
								{ this.colors.length > 2 &&
								<Button className="is-link" style={ { marginRight: 'auto', padding: '0 10px 12px' } }
									onClick={ () => this.removeColor( i ) }
								>
									{ __( 'Remove', 'wpv-views' ) }
								</Button>
								}
								<ColorPicker
									color={ color }
									onChange={ value => this.setColor( value, i ) }
								/>
							</PanelRow>
							{ disableLastStopBecauseOfRepeating &&
							<p className="components-base-control__help">{ __( 'Repeating uses the last color stop.', 'wpv-views' ) }</p>
							}
							{ ! disableLastStopBecauseOfRepeating &&
							<RangeControl
								value={ color.stop || '' }
								onChange={ value => this.setColorStop( value, i ) }
								min={ -20 }
								max={ 120 }
								{ ...rangeHelp }
							/>
							}
						</Fragment>
					);
				} ) }

				<button className="components-button is-primary is-small"
					onClick={ this.addColor }>{ __( 'Add Color', 'wpv-views' ) }</button>
			</Fragment>
		);
	}
}
