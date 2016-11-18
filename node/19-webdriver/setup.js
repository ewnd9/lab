'use strict';

const wdio = require('webdriverio');
const webdrivercss = require('webdrivercss');

const options = {
  desiredCapabilities: {
    browserName: 'firefox'
  }
};

const browser = wdio.remote(options);
webdrivercss.init(browser, {
  screenWidth: [320,640,1024]
});

function runner(job) {
  const http = require('http');
  const ecstatic = require('ecstatic');
  const spawn = require('child_process').spawn;

  const proc = spawn('./node_modules/.bin/selenium-standalone', ['start'], { stdio: [0, 1, 2] });

  const server = http
    .createServer(ecstatic({ root: __dirname + '/src' }))
    .listen(8000);

  setTimeout(() => {
    job(browser)
      .then(() => {
        server.close();
        proc.kill('SIGINT');
      })
      .catch(err => console.log(err.stack || err));
  }, 1000);
}

exports.browser = browser;
exports.runner = runner;
