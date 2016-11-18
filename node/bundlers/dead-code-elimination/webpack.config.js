'use strict';

const webpack = require('webpack');

module.exports = {
  entry: __dirname + '/src/index.js',
  output: {
    path: __dirname + '/dist/',
    filename: 'bundle.webpack.js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
      }
    })
  ]
};
