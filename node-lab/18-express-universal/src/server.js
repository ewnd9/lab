'use strict';

import express from 'express';
import morgan from 'morgan';

import renderReact from './server-render';

const app = express();

app.use(morgan('request: :remote-addr :method :url :status'));
app.get('/', reactRoute);
app.use(express.static(__dirname + '/public'));
app.get('*', reactRoute);

function reactRoute(req, res, next) {
  renderReact(req.path)
    .then(html => res.end(html))
    .catch(err => next(err));
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
