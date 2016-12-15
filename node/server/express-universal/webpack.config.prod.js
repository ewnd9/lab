'use strict';

if (typeof process.env.NODE_ENV === 'undefined') {
  process.env.NODE_ENV = 'production';
}

var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var config = require(__dirname + '/webpack.config.dev');
var vendors = ['react'];

config.entry = {
  app: config.entry[config.entry.length - 1],
  vendors: vendors
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
  new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.[hash].js'),
  new ExtractTextPlugin('styles.css', '[name].[contenthash].css')
]).concat([
  new webpack.optimize.UglifyJsPlugin({
    compressor: {
      warnings: false
    }
  })
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
