#!/usr/bin/env node

// extracted from https://github.com/mxstbr/react-boilerplate/blob/v3.0.0/webpack/pagespeed

var log = console.log.bind(console);
var port = process.argv[2];

if (!port) {
  console.log('usage "$ node index 3000"');
  process.exit(0);
}

var ngrok = require('ngrok');
var psi = require('psi');

log('Starting ngrok tunnel');

ngrok.connect(+port, function (err, url) {
  if (err) {
    log('\nERROR\n' + err);
    process.exit(0);
  }

  log('Serving tunnel from: ' + url);
  log('Starting PageSpeed Insights');

  const report = strategy => psi.output(url, { strategy });

  report('mobile')
    .then(() => report('desktop'), () => report('desktop'));
});
