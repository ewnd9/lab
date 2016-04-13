var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var argv = require('minimist')(process.argv.slice(2));
var cwd = process.cwd();

var entry = './src/client.js';
var html = './src/components/index.html';
var output = './dist';
var vendors = ['react'];
var publicPath = argv['x-public-path'] || '/';

module.exports = {
  entry: {
    app: entry,
    vendors: vendors
  },
  devtool: 'cheap-module-source-map',
  output: {
    filename: '[name].bundle.js',
    sourceMapFilename: '[file].map',
    path: output,
    // publicPath: publicPath
  },
  resolve: {
    root: [
      path.join(cwd, 'src'),
      path.join(cwd, 'node_modules'),
    ],
    moduleDirectories: [
      'node_modules'
    ]
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel'
      },
      {
        test: /\.html$/,
        loader: 'file?name=[name].[ext]',
      },
      {
        test: /\.css$/,
        exclude: /components/,
        loader: 'style-loader!css-loader!postcss-loader'
      },
      {
        test: /\.css$/,
        include: /components/,
        loader: 'style-loader!css-loader?modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader'
      },
      { test: /\.png$/, loader: 'url-loader?limit=100000' },
      { test: /\.jpg$/, loader: 'file-loader' },
      { test: /\.gif$/, loader: 'file-loader' },
      { test: /\.json$/, loader: 'file-loader' },
      { test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff' },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream' },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml' }
    ]
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: html,
      inject: 'body'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        APP_ENV: JSON.stringify('browser')
      },
      '__dirname': JSON.stringify(__dirname + '/dist')
    })
  ],
  postcss: function(webpack) {
    return [
      require('autoprefixer'),
      require('postcss-import')({
        addDependencyTo: webpack
      }),
      require('postcss-cssnext')
    ];
  },
  devServer: {
    contentBase: output,
    noInfo: true,
    hot: true,
    inline: true,
    historyApiFallback: true
  }
};
