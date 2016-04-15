'use strict';

var webpack = require('webpack');
var fs = require('fs');
var nodeExternals = require('webpack-node-externals');

var config = require(__dirname + '/webpack.config.prod');

config.target = 'node';
config.entry = __dirname + '/src/server.js';
config.node = {
  __filename: false,
  __dirname: false
};
config.output.filename = 'backend.js';
config.externals = [nodeExternals()];

config.plugins = config.plugins.reduce(function(total, curr) {
  if (!(curr instanceof webpack.optimize.CommonsChunkPlugin) &&
      !(curr instanceof webpack.optimize.UglifyJsPlugin)) {
    total.push(curr);
  }

  return total;
}, []);

module.exports = config;
