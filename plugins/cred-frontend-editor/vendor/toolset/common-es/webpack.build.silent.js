const merge = require( 'webpack-merge' );
const build = require( './webpack.build.js' );

module.exports = merge( build, {
	stats: 'none',
} );
