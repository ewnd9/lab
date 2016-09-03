import test from 'ava';
import 'babel-register';

import flatten from './index';

test('test-1', async t => {
  const routes = require('./fixtures/test-1').routes;
  t.deepEqual(flatten(routes), ['/', '/about']);
});

test('test-2', async t => {
  const routes = require('./fixtures/test-2').routes;
  t.deepEqual(flatten(routes), ['/', '/about', '/inbox', '/inbox/messages/:id' ]);
});

test('test-3', async t => {
  const routes = require('./fixtures/test-3').routes;
  // t.deepEqual(flatten(routes), ['/', '/about', '/inbox', '/inbox/messages/:id' ]);
  console.log(flatten(routes));
});
