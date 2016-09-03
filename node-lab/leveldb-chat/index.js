'use strict';

const fs = require('fs');
const http = require('http');
const browserify = require('browserify');

const createDb = require('./db');
const { db, dbSocket, changesSocket } = createDb('./chat.db');

const isProd = process.env.NODE_ENV === 'production';

const server = http.createServer(function(req, res) {
  switch (req.url) {
    case '/':
      fs.createReadStream('./frontend/index.html').pipe(res);
      break;
    case '/client.js':
      res.writeHead(200, {'Content-Type': 'application/javascript'});

      if (isProd) {
        fs.createReadStream('./dist/app.js').pipe(res);
      } else {
        browserify('./frontend/client.js').bundle().pipe(res);
      }

      break;
    default:
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end(`${res.url} not found`);
  }
});

dbSocket.install(server, '/wsdb');
changesSocket.install(server, '/wschanges');

const port = 3000;

server.listen(port, function() {
  console.log(`listening ${port}`);
});
