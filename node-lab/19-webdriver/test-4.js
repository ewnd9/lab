'use strict';

const menuIcon = {
  name: 'Menu Icon',
  elem: '.menu a'
};

const menu = {
  name: 'Menu',
  elem: '.main_menu'
};

const projectLink = `${menu.elem} a[href$=project]`;

const runner = require('./setup').runner;

runner(browser => {
  return browser
    .init()
    .url('http://outdatedbrowser.com/en')
    .webdrivercss('Main Menu Menu Icon', menuIcon)
    .click(menuIcon.elem)
    .webdrivercss('Main Menu Open', menu)
    .click(projectLink)
    // WebdriverIO will wait here until the "About" page loads
    .click(menuIcon.elem)
    .webdrivercss('Main Menu - Projects Page', menu)
    .getUrl()
    .then(function(url) {
      console.log(url);
      // outputs:
      // http://outdatedbrowser.com/en/project
    })
    .end();
});
