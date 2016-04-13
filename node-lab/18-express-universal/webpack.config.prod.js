var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

if (typeof process.env.NODE_ENV === 'undefined') {
  process.env.NODE_ENV = 'production';
}

var config = require(__dirname + '/webpack.config');

config.entry = {
  app: __dirname + '/src/client',
  vendors: ['react']
};
config.devtool = 'source-map';
config.output.filename = '[name].bundle.[hash].js';

var prodPlugins = config.plugins.reduce((total, curr) => {
  if (!(curr instanceof webpack.HotModuleReplacementPlugin)) {
    total.push(curr);
  }

  return total;
}, [
  new webpack.optimize.OccurenceOrderPlugin(),
  // new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.[hash].js'), // IMPORTANT BREAKS BACKEND
  new ExtractTextPlugin('styles.css', '[name].[contenthash].css')
]).concat([
  // new webpack.optimize.UglifyJsPlugin({
  //   compressor: {
  //     warnings: false
  //   }
  // })
]);

config.plugins = prodPlugins;

var prodLoaders = config.module.loaders.reduce((total, curr) => {
  if (curr.loader && curr.loader.indexOf('style-loader') > -1) {
    var data = curr.loader.split('!');
    curr.loader = ExtractTextPlugin.extract('style-loader', data.slice(1).join('!'));
  }

  total.push(curr);
  return total;
}, []);

config.module.loaders = prodLoaders;

module.exports = config;
