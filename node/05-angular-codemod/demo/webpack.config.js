const config = {
  entry: './src/index.js',
  module: {
    preLoaders: [
      {
        test: /\/src\/components\/(.*)\/(\1)\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: [],
          plugins: ['babel-plugin-annotate-export-default']
        }
      },
      {
        test: /\/src\/config\/.+\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: [],
          plugins: ['babel-plugin-annotate-export-functions']
        }
      }
    ],
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      },
    ]
  },
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js'
  }
};

if (process.env.NODE_ENV === 'production') {
  const webpack = require('webpack');
  const uglify = new webpack.optimize.UglifyJsPlugin({
    compressor: {
      warnings: false
    }
  });

  config.plugins = [
    uglify
  ];
}

module.exports = config;
