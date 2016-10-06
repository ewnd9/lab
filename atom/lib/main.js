'use babel';
/* @flow */
/* global atom */

function activate() {
  const libs = [
    require('./libs/declare-constant'),
    require('./libs/insert-previous-directory'),
    require('./libs/run-jscodeshift'),
    require('./libs/node-modules-dialog/')
  ];

  libs.forEach(lib => lib());
}

module.exports = {
  activate,
};
