'use strict';

var fs = require('fs');
var path = require('path');
var express = require('express');
var app = express();
var port = process.env.PORT || 7777;

var pify = require('pify');
var psi = require('psi');
var localtunnel = pify(require('localtunnel'));

app.get('/', home);
app.get('/insights', insights);
app.listen(port, listening);

function listening () {
  console.log('Listening on port', port);
}

function home (req, res) {
  var file = path.join(__dirname, 'index.html');
  var index = fs.readFileSync(file, 'utf8');
  res.send(index);
}

function insights (req, res, next) {
  // get the PageSpeed Insights report
  localtunnel(port)
    .then(tunnel => {
      return psi(tunnel.url);
    })
    .then(stats => {
      res.json({
        resources: {
          js: stats.pageStats.numberJsResources,
          css: stats.pageStats.numberCssResources,
          total: stats.pageStats.numberResources,
          hosts: stats.pageStats.numberHosts
        }
      });
    })
    .catch(err => next(err));
}
