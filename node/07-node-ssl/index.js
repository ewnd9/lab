'use strict';

const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');

const options = {
  key: fs.readFileSync('./cert/server-key.pem'),
  cert: fs.readFileSync('./cert/server-crt.pem'),
  ca: fs.readFileSync('./cert/ca-crt.pem'),
  requestCert: true,
  rejectUnauthorized: true
};

const app = express();

app.get('*', (req, res) => {
  res.json({ url: req.url });
});

if (!module.parent) {
  start();
}

module.exports = start;

function start() {
  http.createServer(app).listen(8000);
  https.createServer(options, app).listen(8080);

  console.log('http://localhost:8000/');
  console.log('https://localhost:8080/');
}
