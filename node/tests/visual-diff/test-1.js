'use strict';

'use strict';

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
