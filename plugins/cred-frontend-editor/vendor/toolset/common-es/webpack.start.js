const merge = require( 'webpack-merge' );
const common = require( './webpack.common.js' );

const start = merge( common, {
	mode: 'development',
	devtool: 'inline-source-map',
} );

module.exports = [ start ];
