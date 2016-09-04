'use babel';
/* @flow */
/* global atom */

function activate() {
  const libs = [
    require('./libs/declare-constant'),
    require('./libs/insert-previous-directory')
  ];

  libs.forEach(lib => lib());
}

module.exports = {
  activate,
};
