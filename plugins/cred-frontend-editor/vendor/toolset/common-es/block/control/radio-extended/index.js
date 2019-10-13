/**
 * WordPress dependencies
 */
import { withInstanceId } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import {
	BaseControl,
	Tooltip,
} from '@wordpress/components';

import './style.scss';

function RadioControlExtended( { label, selected, className, help, instanceId, onChange, options = [] } ) {
	const id = `inspector-radio-control-extended-${ instanceId }`;
	const onChangeValue = ( event ) => onChange( event.target.value );

	return Object.keys( options ).length && (
		<BaseControl label={ label } id={ id } help={ help } className={ [ className, 'components-radio-control' ].join( ' ' ) }>
			{ options.map( ( option, index ) =>
				<div
					key={ `${ id }-${ index }` }
					className="components-radio-control__option"
				>
					<input
						id={ `${ id }-${ index }` }
						className="components-radio-control__input"
						type="radio"
						name={ id }
						value={ option.value }
						onChange={ onChangeValue }
						checked={ option.value === selected }
						aria-describedby={ !! help ? `${ id }__help` : undefined }
					/>
					<label htmlFor={ `${ id }-${ index }` }>
						{ option.label }
						{ !! option.help &&
							<Tooltip text={ option.help } className={ `${ className }__tooltip ${ className }__tooltip--${ option.value }` } >
								<span className={ 'components-radio-control__help-icon' } />
							</Tooltip>
						}
					</label>
				</div>
			) }
		</BaseControl>
	);
}

export default withInstanceId( RadioControlExtended );
