import wsock from 'websocket-stream';
const stream = wsock('ws://localhost:8000');

import split from 'split2';
import through from 'through2';
import onend from 'end-of-stream';

import { ADD_LOG, bus } from './state';

stream
  .pipe(split())
  .pipe(through(function (line, enc, next) {
    const data = JSON.parse(line);

    console.log('line', data);
    bus.emit(ADD_LOG, `Log: ${JSON.stringify(data)}`);

    next();
  }));
