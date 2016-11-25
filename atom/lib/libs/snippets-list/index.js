'use babel';
/* @flow */
/* global atom */

/*
- atom: print all snippets
  - `atom.workspace.open('/home/ewnd9/.atom/snippets/js.cson')`
  - `<atom-panel class='modal'>` in styleguide
  - `atom.workspace.getActiveTextEditor().foldAllAtIndentLevel(2)`
*/
export default () => {
  const fs = require('pify')(require('fs'));
  const root = `${process.env.HOME}/.atom/snippets`;

  fs
    .readdir(root)
    .then(files => {
      const commands = files.reduce((total, file) => {
        total[`snippets:${file.split('.')[0]}`] = openSnippet.bind(null, file);
        return total;
      }, {});

      atom.commands.add('atom-workspace', commands);

      function openSnippet(file) {
        atom.workspace.open(`${root}/${file}`);
      }
    })
    .catch(err => console.log(err.stack || err))
};
