'use babel';
/* @flow */
/* global atom */

/*
- rootDir <- click here
  - category-a-file-a.md
  - category-a-file-b.md
  - category-b-file-a.md
  - category-b-file-b.md

becomes

- rootDir <- click here
  - category-a
    - category-a-file-a.md
    - category-a-file-b.md
  - category-b
    - category-b-file-b.md
    - category-b-file-b.md
*/

let fs;

export default () => {

  atom.commands.add('.tree-view .directory.selected', {
    'refactor-md:collapse': function() {
      const root = this.getPath();
      refactorMdCollapse(root);
    }
  });
};

export function refactorMdCollapse(root) {
  fs = fs || require('pify')(require('fs'));

  return fs
    .readdir(root)
    .then(collapse)
    .catch(err => {
      throw err;
    });

  function collapse(files, level = 1) {
    const groups = files.reduce((groups, file) => {
      const parts = file.split('-');

      if (parts.length < level) {
        return groups;
      }

      const prefix = parts.slice(0, level).join('-');

      groups[prefix] = groups[prefix] || [];
      groups[prefix].push(file);
      return groups;
    }, {});

    const groupNames = Object.keys(groups);

    if (groupNames.length === 0) {
      return;
    }

    if (groupNames.length === 1) {
      return collapse(files, level + 1);
    }

    if (groupNames.length === 2) {
      const minLength = Math.min(groups[groupNames[0]].length, groups[groupNames[1]].length);
      if (minLength === 1) {
        return collapse(files, level + 1);
      }
    }

    return Promise.all(groupNames
      .map(name => {
        const group = groups[name];

        if (group.length === 1) {
          return;
        }

        const newDir = `${root}/${name}`;

        return fs
          .mkdir(newDir)
          .then(() => {
            return Promise.all(group.map(file => {
              return fs.rename(`${root}/${file}`, `${newDir}/${file}`);
            }));
          })
          .catch(err => console.log(err.stack || err));
      }));
  }
}
