'use strict';

// https://github.com/klamping/vrt-email-course/blob/master/manuscript/day-3.md
const runner = require('./setup').runner;

runner(browser => {
  return browser
    .init()
    .url("https://learn.visualregressiontesting.com")
    .webdrivercss("homepage",[
      {
        name: "header",
        elem: ".header"
      },
      {
        name: "benefits",
        elem: ".benefits",
        screenWidth: [320,640,1024]
      }
    ])
    .end();
});
