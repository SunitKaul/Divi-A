const merge = require( 'webpack-merge' );
const common = require( './webpack.common.js' );
const StyleLintPlugin = require( 'stylelint-webpack-plugin' );

// Export with style
module.exports = merge( common, {
	mode: 'production',
	stats: 'minimal',
} );

// Setup ESLint
module.exports.module.rules.unshift(
	{
		enforce: 'pre',
		test: /\.js$/,
		exclude: /(node_modules|bower_components)/,
		loader: 'eslint-loader',
		options: {
			emitWarning: true,
		},
	},
);

// Setup StyleLintPlugin
module.exports.plugins.push(
	new StyleLintPlugin(
		{
			configFile: './.stylelintrc',
			context: './scss',
			syntax: 'scss',
		},
	),
);

