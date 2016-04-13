var webpack = require('webpack');
var fs = require('fs');
var nodeExternals = require('webpack-node-externals');

var config = require(__dirname + '/webpack.config.prod');

config.target = 'node';
config.entry = './src/server.js';
config.node = {
  __filename: true,
  __dirname: true
};
config.output.filename = 'backend.js';
config.externals = [nodeExternals()];

module.exports = config;
