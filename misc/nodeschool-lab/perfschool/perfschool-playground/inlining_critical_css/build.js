'use strict';

var path = require('path')
var cmd = path.resolve(__dirname, '..', '..', 'node_modules', '.bin', 'phantomjs');
var penthouse = path.resolve(require.resolve('penthouse'), '..', '..', 'penthouse.js');

var serveStatic = require('serve-static');
var express = require('express');
var app = express();
var port = process.env.PORT || 7777;

app.use(serveStatic(__dirname));
var server = app.listen(port, listening);

function listening () {
  var args = [penthouse, `http://localhost:${port}`, 'super.css'];
  var concat = require('concat-stream');

  var fs = require('fs');
  var cheerio = require('cheerio');

  require('child_process')
    .spawn(cmd, args)
    .stdout
    .pipe(concat(function(data) {
      var css = data.toString();

      var html = fs.readFileSync('./index.html', 'utf-8');
      var $ = cheerio.load(html);
      var $head = $('head');

      var links = $('head').find('link').get();
      $head.find('link').remove();
      $('body').append(links);

      $head.append($(`<style>${css}</style>`));
      fs.writeFileSync('./dist/index.html', $.html(), 'utf-8');

      server.close();
    }));
}
