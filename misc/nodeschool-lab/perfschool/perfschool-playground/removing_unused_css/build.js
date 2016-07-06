'use strict';

var uncss = require('uncss');
var trumpet = require('trumpet')

var fs = require('fs');

var files = ['./index.html'];
var options = {
  // ignore       : ['#added_at_runtime', /test\-[0-9]+/],
  // media        : ['(min-width: 700px) handheld and (orientation: landscape)'],
  // csspath      : '../public/css/',
  // raw          : 'h1 { color: green }',
  // stylesheets  : ['lib/bootstrap/dist/css/bootstrap.css', 'src/public/css/main.css'],
  // ignoreSheets : [/fonts.googleapis/],
  // timeout      : 1000,
  // htmlroot     : 'public',
  // report       : false,
  // uncssrc      : '.uncssrc'
};

uncss(files, options, function(err, output) {
  if (err) {
    throw err;
  }

  fs.writeFile('./dist/index.css', output, 'utf-8');

  var tr0 = trumpet();

  tr0.selectAll('link', function(elem) {
    if (elem.getAttribute('href') !== '/index.css') {
      elem.createWriteStream({ outer: true }).end();
    }
  });

  var rs = fs.createReadStream('./index.html');
  rs.pipe(tr0).pipe(fs.createWriteStream('./dist/index.html'));
});
