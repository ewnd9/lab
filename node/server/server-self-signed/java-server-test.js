import test from 'ava';

import fs from 'fs';
import https from 'https';
import getStream from 'get-stream';
import got from 'got';

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
