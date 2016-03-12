import fs from 'fs';
import path from 'path';
import xtend from 'xtend';
import hyperstream from 'hyperstream';

import ecstatic from 'ecstatic';
const st = ecstatic(path.join(__dirname, '..', 'public'));

import createElement from 'virtual-dom/create-element';

import http from 'http';
import router from './routes';

const server = http.createServer(function(req, res) {
  const state = { path: req.url };
  const m = router.match(req.url);

  if (m) {
    const elem = createElement(m.fn(xtend(m, { state: state })));

    fs
      .createReadStream(path.join(__dirname, '..', 'public', 'index.html'))
      .pipe(hyperstream({ '#content': elem.toString() }))
      .pipe(res);
  } else {
    st(req, res);
  }
});

server.listen(8000);
console.log('localhost:8000');
