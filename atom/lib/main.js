'use babel';
/* @flow */
/* global atom */

function activate() {
  const libs = [
    require('./libs/declare-constant'),
    require('./libs/insert-previous-directory'),
    require('./libs/run-jscodeshift'),
    require('./libs/open-oldest-file'),
    // require('./libs/ast-refactor/'), @TODO
    require('./libs/node-modules-dialog/'),
    require('./libs/refactor-md/'),
    require('./libs/snippets-list/')
  ];

  libs.forEach(lib => lib());
}

module.exports = {
  activate,
};
