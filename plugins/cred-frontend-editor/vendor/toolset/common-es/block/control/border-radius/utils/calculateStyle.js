import { getNumberOr } from '../../../../utils';

export default function( borderRadius ) {
	return borderRadius.topLeft > 0 &&
  borderRadius.topLeft === borderRadius.topRight &&
  borderRadius.bottomLeft === borderRadius.bottomRight &&
  borderRadius.bottomRight === borderRadius.topLeft ?
		{
			borderRadius: `${ borderRadius.topLeft }px`,
		} : {
			borderTopLeftRadius: getNumberOr( borderRadius.topLeft ) !== '' ? `${ borderRadius.topLeft }px` : undefined,
			borderTopRightRadius: getNumberOr( borderRadius.topRight ) !== '' ? `${ borderRadius.topRight }px` : undefined,
			borderBottomLeftRadius: getNumberOr( borderRadius.bottomLeft ) !== '' ? `${ borderRadius.bottomLeft }px` : undefined,
			borderBottomRightRadius: getNumberOr( borderRadius.bottomRight ) !== '' ? `${ borderRadius.bottomRight }px` : undefined,
		};
}
