const config = {
  entry: './src/index.js',
  module: {
    preLoaders: [
      {
        test: file => {
          const match = /\/src\/components\/(.*)\/(\1)\.js$/.test(file);
          console.log(file, match);
          return match;
        },
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          plugins: ['babel-plugin-annotate-export-default']
        }
      }
    ],
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
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
