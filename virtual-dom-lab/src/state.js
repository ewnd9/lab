import xtend from 'xtend';
import main from 'main-loop';

const state = {
  path: location.pathname,
  logs: []
};

let loop;

export function init(render, vDom) {
  loop = main(state, render, vDom);
  return loop;
};

import { EventEmitter } from 'events';
export const bus = new EventEmitter();

export const ADD_LOG = 'ADD_LOG';
export const UPDATE_PATH = 'UPDATE_PATH';

bus.on(ADD_LOG, log => {
  loop.update(xtend(loop.state, { logs: state.logs.concat(log) }));
});

bus.on(UPDATE_PATH, path => {
  loop.update(xtend(loop.state, { path }));
});
