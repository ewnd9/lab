'use strict';

var config = require('./node_modules/webpackman/webpack.config.js');
var HtmlWebpackPlugin = require('html-webpack-plugin');

config.entry = [
  'webpack-hot-middleware/client?reload=true',
  __dirname + '/src/app/index.js'
];

config.output.path = __dirname + '/dist';
config.output.publicPath = '/';

config.plugins = config.plugins.reduce((total, curr) => {
  if (curr instanceof HtmlWebpackPlugin) {
    total.push(new HtmlWebpackPlugin({
      template: __dirname + '/src/app/index.html',
      inject: 'body'
    }));
  } else {
    total.push(curr);
  }

  return total;
}, []);

module.exports = config;
