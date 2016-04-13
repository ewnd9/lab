'use strict';

import express from 'express';
import morgan from 'morgan';
import path from 'path';

const app = express();

app.use(morgan('request: :remote-addr :method :url :status'));

if (process.env.NODE_ENV === 'production') {
  const renderReact = require('./server-render').default;

  app.get('/', reactRoute);
  app.use(express.static(__dirname));
  app.get('*', reactRoute);

  function reactRoute(req, res, next) {
    renderReact(req.path)
      .then(html => res.end(html))
      .catch(err => next(err));
  }
} else {
  const webpack = require('webpack');
  const webpackMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');

  const config = require('../webpack.config');
  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, { ...config.devServer, contentBase: __dirname });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));

  app.get('*', function response(req, res) {
    middleware.fileSystem
      .createReadStream(path.resolve(__dirname + '/../dist/index.html'))
      .pipe(res);
  });
}

app.use(function(err, req, res, next) { // should be last
  if (!err) {
    next();
    return;
  }

  console.log(err.stack);
  res.status(err.status || 500).json({ status: 'error' });
});

const port = 3000;
app.listen(port, () => console.log(`localhost:${port}`));
