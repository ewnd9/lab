import test from 'ava';

import fs from 'fs';
import https from 'https';
import getStream from 'get-stream';
import got from 'got';
import startServer from './index';

test.before(async t => {
  startServer();
});

test('https module', async t => {
  const agentOptions = {
    host: 'localhost',
    port: '8080',
    path: '/',
    key: fs.readFileSync('./cert/client1-key.pem'),
    cert: fs.readFileSync('./cert/client1-crt.pem'),
    ca: fs.readFileSync('./cert/ca-crt.pem')
  };

  const agent = new https.Agent(agentOptions);

  const options = {
    hostname: 'localhost',
    port: 8080,
    schema: 'https',
    path: '/https-ava-test',
    method: 'GET',
    agent
  };

  const res = await new Promise(resolve => {
    const req = https.request(options, function(res) {
      getStream(res).then(resolve);
    });

    req.end();
  });

  const data = JSON.parse(res);
  t.truthy(data.url === options.path);
});

test('got module', async t => {
  const options = {
    strictSSL: true,
    key: fs.readFileSync('./cert/client1-key.pem'),
    cert: fs.readFileSync('./cert/client1-crt.pem'),
    ca: fs.readFileSync('./cert/ca-crt.pem'),
    json: true
  };

  const url = '/got-ava-test';

  const { body } = await got(`https://localhost:8080${url}`, options);
  t.truthy(body.url === url);
});
