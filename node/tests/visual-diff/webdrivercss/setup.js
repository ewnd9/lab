'use strict';

const wdio = require('webdriverio');
const webdrivercss = require('webdrivercss');
const exitHook = require('exit-hook');
const { SELENIUM } = process.env;

const Xvfb = require('xvfb');
const xvfb = new Xvfb({
  displayNum: 99,
  reuse: true,
  xvfb_args: ['-screen', '0', '2880x1800x24']
});
xvfb.startSync();

let proc;

// process might be stoped with xvfb and child_process still opened hence exit hook
// process cannot be stopped without closing server first hence it's at the end of file
exitHook(() => {
  xvfb.stopSync();

  if (proc) {
    proc.kill('SIGTERM');
  }
})

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
      .catch(err => console.log(err.stack || err))
      .then(() => {
        server.close();
        process.exit(0);
      });
  }, 1000);
}

exports.browser = browser;
exports.runner = runner;
