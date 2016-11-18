'use babel';
/* @flow */
/* global atom */

export default () => {
  atom.commands.add('atom-workspace', {
    'open-oldest-file': () => {
      const fs = require('fs');
      const pify = require('pify');
      const lstat = pify(fs.lstat);

      const orderBy = require('lodash.orderby');
      const globby = require('globby');

      const root = atom.project.getPaths()[0];

      globby(['**/*.md'], { cwd: root, ignore: ['**/node_modules/**'] })
        .then(paths => {
          return Promise.all(paths.map(p => {
            const path = `${root}/${p}`;

            return lstat(path)
              .then(stat => ({ path, stat, mtime: stat.mtime.toISOString() }));
          }));
        })
        .then(stats => {
          const xs = orderBy(stats, x => x.mtime);

          if (xs.length === 0) {
            atom.notifications.addInfo('No markdown files');
            return;
          }

          atom.notifications.addInfo(`Modify Time: ${xs[0].mtime}`);
          atom.workspace.open(xs[0].path);
        })
        .catch(err => console.log(err.stack || err));
    }
  });
};
