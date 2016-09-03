import React from 'react';
import { renderToString } from 'react-dom/server';
import { App, rootId } from './app';

import fs from 'fs';
import http from 'http';
import ecstatic from 'ecstatic';

const data = fs.readFileSync('./dist/index.html', 'utf-8');
const publicRender = ecstatic({ root: __dirname + '/dist' });

const server = http
  .createServer((req, res) => {
    console.log(req.url);

    const result = data.replace(`<div id="${rootId}"></div>`, `<div id="${rootId}">${renderToString(<App />)}</div>`);
    // const result = data;

    console.log(result);

    if (req.url === '/') {
      res.end(result);
    } else {
      publicRender(req, res);
    }
  })
  .listen(8080);
// console.log(renderToString(<App />));
