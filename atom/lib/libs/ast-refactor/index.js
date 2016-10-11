'use babel';
/* @flow */
/* global atom */
import j from 'jscodeshift';

export default () => {
  const editor = atom.workspace.getActiveTextEditor();

  const file = j(editor.getText());
  const result = {};

  file
    .find(j.Identifier)
    .forEach(path => {
      let parent = path.parentPath.value;

      if (Array.isArray(parent)) {
        parent = path.parentPath.parentPath.value;
      }

      const { name } = path.value;

      result[name] = result[name] || {};
      result[name][parent.type] = result[name][parent.type] || [];
      result[name][parent.type].push(path);
    });

  console.log(result)
  // select('name')

  function select(name) {
    const r = result[name];

    const xs = Object
      .keys(r)
      .reduce((total, key) => {
        return total.concat(
          r[key].filter(obj => obj.value.loc)
        );
      }, []);

    if (xs.length > 0) {
      editor.getCursors()[0].destroy()

      xs.forEach(obj => {
        const { column, line } = obj.value.loc.end;
        editor.addCursorAtScreenPosition([line - 1, column]);
      });
    }
  }


};
