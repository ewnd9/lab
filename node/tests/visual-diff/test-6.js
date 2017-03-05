'use strict';

// https://github.com/klamping/vrt-email-course/blob/master/manuscript/day-4.md
const runner = require('./setup').runner;

const menuIcon = {
  name: 'Menu Icon',
  elem: '.menu a'
};

const menu = {
  name: 'Menu',
  elem: '.main_menu'
};

runner(browser => {
  return browser
    .init()
    .url("http://outdatedbrowser.com/en")
    .webdrivercss('Main Menu Icon', menuIcon)
    .click(menuIcon.elem)
    .pause(1000)
    .webdrivercss('Main Menu - Open', menu)
    .click('=THE PROJECT')
    .webdrivercss('Main Menu Icon - Projects', menuIcon)
    .getUrl()
    .then(function(url) {
      console.log("Page url is: " + url);
    })
    .end();
});
