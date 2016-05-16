'use strict';

const runner = require('./setup').runner;

runner(browser => {
  return browser
    .init()
    .url('http://localhost:8000/')
    .webdrivercss('localhost', [
      {
        name: 'hello',
        elem: '#hello'
      }
    ])
    .end();
});
