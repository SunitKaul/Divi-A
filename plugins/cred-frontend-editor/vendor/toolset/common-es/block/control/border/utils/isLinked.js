/**
 * Function to check if the border is linked or not based on all 4 border sides.
 *
 * @param {object} border
 * @returns {boolean}
 *
 * @since 1.0
 */
export default function( border ) {
	const jsonBorderTop = JSON.stringify( border.top ),
		jsonBorderRight = JSON.stringify( border.right ),
		jsonBorderBottom = JSON.stringify( border.bottom ),
		jsonBorderLeft = JSON.stringify( border.left );

	return jsonBorderTop === jsonBorderRight &&
			jsonBorderRight === jsonBorderBottom &&
			jsonBorderBottom === jsonBorderLeft;
}
