'use babel';
/* @flow */
/* global atom */

function activate() {
  const libs = [
    require('./libs/insert-previous-directory')
  ];

  libs.forEach(lib => lib());
}

module.exports = {
  activate,
};
