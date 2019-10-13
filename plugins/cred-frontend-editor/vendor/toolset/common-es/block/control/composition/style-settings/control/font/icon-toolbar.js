// External dependencies
import { without, union } from 'lodash';

// Internal dependencies
import { BaseControl, Toolbar } from '@wordpress/components';
import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export default class extends Component {
	render() {
		const { data, setAttributes } = this.props;

		const fontWeight = data.fontWeight || null;
		const fontStyle = data.fontStyle || [];
		const textDecoration = data.textDecoration || [];

		return (
			<div className="tces-font-style">
				<BaseControl label={ __( 'Font Style', 'wpv-views' ) }>
					<Toolbar controls={ [ 'bold', 'italic', 'underline', 'line-through' ].map( style => {
						switch ( style ) {
							case 'bold':
								return {
									icon: 'editor-bold',
									title: __( 'Bold', 'wpv-views' ),
									isActive: fontWeight === 'bold',
									onClick: () => {
										const updated = fontWeight === 'bold' ? undefined : 'bold';

										setAttributes( { fontWeight: updated } );
									},
								};
							case 'italic':
								return {
									icon: 'editor-italic',
									title: __( 'Italic', 'wpv-views' ),
									isActive: fontStyle.includes( style ),
									onClick: () => {
										const updated = fontStyle.includes( style ) ?
											without( fontStyle, style ) :
											union( fontStyle, [ style ] );

										setAttributes( { fontStyle: updated } );
									},
								};
							case 'line-through':
							case 'underline':
								return {
									icon: `editor-${ style === 'line-through' ? 'strikethrough' : style }`,
									title: style === 'line-through' ?
										__( 'Strikethrough', 'wpv-views' ) :
										__( 'Underline', 'wpv-views' ),
									isActive: textDecoration.includes( style ),
									onClick: () => {
										const updated = textDecoration.includes( style ) ?
											without( textDecoration, style ) :
											union( textDecoration, [ style ] );

										setAttributes( { textDecoration: updated } );
									},
								};
						}
						return {
							icon: `editor-${ style === 'line-through' ? 'strikethrough' : style }`,
							title: `${ style }`,
							isActive: fontStyle.includes( style ),
							onClick: () => {
								const updated = fontStyle.includes( style ) ?
									without( fontStyle, style ) :
									union( fontStyle, [ style ] );

								setAttributes( { fontStyle: updated } );
							},
						};
					} ) } />
				</BaseControl>
			</div>
		);
	}
}
