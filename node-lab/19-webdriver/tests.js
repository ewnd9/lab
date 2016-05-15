'use strict';

const wdio = require("webdriverio");

const options = {
  desiredCapabilities: {
    browserName: "firefox"
  }
};

const browser = wdio.remote(options);

browser
  .init()
  .url('http://learn.visualregressiontesting.com')
  .getTitle()
  .then(function(title) {
    console.log('Title is: ' + title);
  })
  .end();
