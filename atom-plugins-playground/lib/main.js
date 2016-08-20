'use babel';
/* @flow */
/* global atom */

function activate() {
  const libs = [
    require('./libs/copy-previous-directory') // why not exported as default?
  ];

  libs.forEach(lib => lib());
}

module.exports = {
  activate,
};
