'use babel';
/* @flow */
/* global atom */

const defaultTransforms = [
  'js-codemod-cpojer/transforms/no-vars.js',
  'js-codemod-cpojer/transforms/template-literals.js',
  'js-codemod-cpojer/transforms/unchain-variables.js'
];

const commonjsToImport = ['5to6-codemod/transforms/cjs.js'];
const importToCommonjs = ['js-codemod-ewnd9/transforms/import-to-commonjs.js'];
const redux = ['js-codemod-ewnd9/transforms/redux-replace-switch.js'];

let jscodeshift;
const cache = {};

export default () => {
  atom.commands.add('atom-workspace', {
    'jscodeshift:defaut': () => run(defaultTransforms),
    'jscodeshift:import': () => run(commonjsToImport),
    'jscodeshift:commonjs': () => run(importToCommonjs),
    'jscodeshift:redux-replace-switch': () => run(redux)
  });
};

function run(transforms) {
  const pane = atom.workspace.getActivePane();
  const editor = pane.getActiveEditor();

  if (!cache[transforms]) {
    cache[transforms] = transforms.map(t => require(`${process.env.HOME}/dotfiles/scripts/codemod/${t}`));
  }

  if (!jscodeshift) {
    jscodeshift = require('jscodeshift');
  }

  let source = editor.getSelections()[0].getText();
  let range;

  if (source.length > 0) {
    range = editor.getSelections()[0].getBufferRange();
  } else {
    source = editor.getText();
  }

  const result = cache[transforms].reduce(
    (source, transform) => {
      try {
        return transform({ source }, { jscodeshift }, {});
      } catch (e) {
        console.log(e)
        return source;
      }
    },
    source
  );

  if (range) {
    editor.setTextInBufferRange(range, result);
  } else {
    editor.setText(result);
  }
}

function spawnPromise(bin, args, label) {
  return new Promise((resolve, reject) => {
    const proc = spawn(`jscodeshift`, args);

    proc.stdout.on('data', data => {
      console.log(`stdout (${label}): ${data}`);
    });

    proc.stderr.on('data', data => {
      console.log(`stderr (${label}): ${data}`);
    });

    proc.on('close', resolve);
    proc.on('error', reject);
  });
}
