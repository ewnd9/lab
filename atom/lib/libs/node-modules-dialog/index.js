'use babel';
/* @flow */
/* global atom */

let View;

export default () => {
  atom.commands.add('atom-workspace', {
    'node-modules:select': () => {
      if (!View) {
        View = require('./views/list');
      }

      const view = new View();
      view.show();
    }
  });
};
