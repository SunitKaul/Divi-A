const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const CircularDependencyPlugin = require( 'circular-dependency-plugin' );
const path = require( 'path' );
const webpack = require( 'webpack' );
const convertToCamelCase = ( str ) => {
	return str.replace(
		/\W+(.)/g,
		function( match, chr ) {
			return chr.toUpperCase();
		}
	);
};

module.exports = {
	entry: './index.js',
	output: {
		path: path.resolve( __dirname, './public' ),
		filename: 'toolset-common-es.js',
		library: 'toolsetCommonEs',
		libraryTarget: 'var',
	},
	module: {
		rules: [
			// Babel
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [ '@babel/preset-react' ],
					},
				},
			},
			// Scss
			{
				test: /\.scss$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
					},
					{
						loader: 'css-loader',
						options: {
							url: false,
							sourceMap: true,
						},
					},
					{
						loader: 'postcss-loader',
						options: {
							plugins: [
								require( 'autoprefixer' ),
							],
						},
					},
					{
						loader: 'sass-loader',
						options: {
							url: false,
							sourceMap: true,
						},
					},
				],
			},
		],
	},
	externals: [
		{
			react: 'React',
			'react-dom': 'ReactDOM',
			jquery: 'jQuery',
			lodash: 'lodash',
			ToolsetDynamicSources: 'ToolsetDynamicSources',
		},
		// Define Wordpress libraries as externals
		// see https://webpack.js.org/configuration/externals/#function
		function( context, request, callback ) {
			const wpLibMatches = request.match( /^\@(wp|wordpress)\/(.*)/i );
			if ( wpLibMatches ) {
				return callback( null, 'window.wp.' + convertToCamelCase( wpLibMatches[ 2 ] ) );
			}
			callback();
		},

	],
	plugins: [
		new CircularDependencyPlugin( {
			// exclude detection of files based on a RegExp
			exclude: /a\.js|node_modules/,
			// add errors to webpack instead of warnings
			failOnError: true,
			// set the current working directory for displaying module paths
			cwd: process.cwd(),
		} ),
		new webpack.NamedModulesPlugin(),
		new MiniCssExtractPlugin( {
			filename: 'toolset-common-es.css',
			chunkFilename: '[name].css',
		} ),
	],
	/*
	   THIS KILLS WEBPACK LIBRARY OUTPUT - MEANS FOR NOW: NO FRONTEND / BACKEND SEPARATION FOR CSS
	   @see https://github.com/webpack/webpack/issues/9048
	optimization: {
		splitChunks: {
			cacheGroups: {
				style: {
					test: /style\.scss/,
					name: 'style',
					chunks: 'all',
					enforce: true,
				},
				edit: {
					test: /edit\.scss$/,
					name: 'edit',
					chunks: 'all',
					enforce: true,
				},
			},
		},
	},
	*/
	resolve: {
		alias: {
			'@TestUtils': path.resolve( __dirname, 'test/utils/' ),
		},
	},
};
