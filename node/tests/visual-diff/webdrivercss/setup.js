'use strict';

const wdio = require('webdriverio');
const webdrivercss = require('webdrivercss');
const { SELENIUM } = process.env;

const Xvfb = require('xvfb');
const xvfb = new Xvfb({
  displayNum: 99,
  reuse: true,
  xvfb_args: ['-screen', '0', '2880x1800x24']
});
xvfb.startSync();

const browser = wdio.remote({
  desiredCapabilities: {
    browserName: 'firefox'
  }
});

webdrivercss.init(browser, {
  screenWidth: [320,640,1024]
});

function runner(job) {
  const http = require('http');
  const ecstatic = require('ecstatic');
  const spawn = require('child_process').spawn;

  const proc = SELENIUM ?
    spawn('./node_modules/.bin/selenium-standalone', ['start'], { stdio: [0, 1, 2] }) :
    spawn('./node_modules/.bin/chromedriver', ['--url-base=/wd/hub', '--port=4444'], { stdio: [0, 1, 2] });

  const server = http
    .createServer(ecstatic({ root: __dirname + '/src' }))
    .listen(8000);

  setTimeout(() => {
    job(browser)
      .then(() => {
        console.log('killing process');
        server.close();
        proc.kill('SIGTERM');
        xvfb.stopSync();
      })
      .catch(err => console.log(err.stack || err));
  }, 1000);
}

exports.browser = browser;
exports.runner = runner;
