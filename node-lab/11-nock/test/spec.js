import test from 'ava';
import 'babel/register'
import got from 'got';
import request from 'superagent-bluebird-promise';

import Nock from './helpers/nock-helper';

const nock = Nock(__filename, 'record');

test.before(nock.beforeFn);
test.after(nock.afterFn);

const url = 'https://api.github.com/users/ewnd9';

test(async t => {
  console.time('test');

  await request.get(url)
    .then(function(res) {
      console.log(res.body.login);
    });

  console.timeEnd('test');
});

test.skip(async t => {
  console.time('test');

  await got(url, {
    json: true,
    headers: {
      'accept': 'application/vnd.github.v3+json'
    }
  }).then(res => {
    console.log(res.body.login);
  });

  console.timeEnd('test');
});
