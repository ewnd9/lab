'use strict';

var fs = require('fs');
var path = require('path');
var express = require('express');
var app = express();
var port = process.env.PORT || 7777;

var pify = require('pify');
var localtunnel = pify(require('localtunnel'));

var WebPageTest = require('webpagetest');
var wpt = new WebPageTest('www.webpagetest.org', process.env.API_KEY);
var runTest = pify(wpt.runTest.bind(wpt));

app.get('/', home);
app.get('/test', test);
app.listen(port, listening);

function listening () {
  console.log('Listening on port', port);
}

function home (req, res) {
  var file = path.join(__dirname, 'index.html');
  var index = fs.readFileSync(file, 'utf8');
  res.send(index);
}

function test (req, res, err) {
  localtunnel(port)
    .then(tunnel => {
      return runTest(tunnel.url, { location: 'Dulles:Chrome', pollResults: 5, timeout: 600 });
    })
    .then(stats => {
      const data = stats.data.runs[1];
      const result = {
        timing: {
          ttfb: data.firstView.TTFB,
          speedIndex: data.firstView.SpeedIndex,
          domLoaded: data.firstView.domContentLoadedEventStart
        }
      };

      console.log(result);
      res.json(result);
    })
    .catch(err => {
      console.log(err);
      next(err)
    });
}
