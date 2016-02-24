const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');

const options = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.crt')
};

const app = express();
app.use(express.static('public'));

http.createServer(app).listen(3001);
https.createServer(options, app).listen(3002);
