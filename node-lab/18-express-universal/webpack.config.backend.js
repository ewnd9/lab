var webpack = require('webpack');
var fs = require('fs');

var config = require(__dirname + '/webpack.config.prod');

config.target = 'node';
config.entry = './src/server.js';
config.node = {
  __filename: true,
  __dirname: true
};

config.externals = function(context, request, cb) {
  if(/^[a-z\-0-9]+$/.test(request)) {
    cb(null, 'commonjs ' + request);
    return;
  }
  cb();
};

module.exports = config;
