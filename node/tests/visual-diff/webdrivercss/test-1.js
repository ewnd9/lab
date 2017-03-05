'use strict';

// https://github.com/klamping/vrt-email-course/blob/master/manuscript/day-2.md
const runner = require('./setup').runner;

runner(browser => {
  return browser
    .init()
    .url('http://learn.visualregressiontesting.com')
    .getTitle()
    .then(function(title) {
      console.log('Title is: ' + title);
    })
    .end();
});
