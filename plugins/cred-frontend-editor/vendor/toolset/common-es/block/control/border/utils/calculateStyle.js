// Internal dependencies
import isLinked from './isLinked';
import { getNumberOr } from '../../../../utils';

function printStyle( border ) {
	return `${ border.width }${ border.widthUnit } ${ border.style } ` +
		`rgba( ${ border.color.rgb.r }, ${ border.color.rgb.g }, ` +
		`${ border.color.rgb.b }, ${ border.color.rgb.a } )`;
}

export default function( border ) {
	return border.top.width > 0 && isLinked( border ) ?
		{
			border: printStyle( border.top ),
		} : {
			borderTop: getNumberOr( border.top.width ) !== '' ? printStyle( border.top ) : undefined,
			borderRight: getNumberOr( border.right.width ) !== '' ? printStyle( border.right ) : undefined,
			borderBottom: getNumberOr( border.bottom.width ) !== '' ? printStyle( border.bottom ) : undefined,
			borderLeft: getNumberOr( border.left.width ) !== '' ? printStyle( border.left ) : undefined,
		};
}
