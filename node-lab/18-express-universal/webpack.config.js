module.exports = {
  entry: './src/client.js',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      },
    ]
  },
  output: {
    path: __dirname + '/src/public',
    filename: 'bundle.js'
  }
};
