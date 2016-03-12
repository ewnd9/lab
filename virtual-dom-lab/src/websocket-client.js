const wsock = require('websocket-stream');
const stream = wsock('ws://localhost:8000');

const split = require('split2');
const through = require('through2');
const onend = require('end-of-stream');

stream
  .pipe(split())
  .pipe(through(function (line, enc, next) {
    const data = JSON.parse(line);
    console.log('line', data);
    next();
  }));
