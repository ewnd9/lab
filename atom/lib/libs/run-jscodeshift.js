'use babel';
/* @flow */
/* global atom */

import { spawn } from 'child_process';

const defaultTransforms = [
  'js-codemod-cpojer/transforms/no-vars.js',
  'js-codemod-cpojer/transforms/template-literals.js',
  'js-codemod-cpojer/transforms/unchain-variables.js'
];

const commonjsToImport = '5to6-codemod/transforms/cjs.js';
const importToCommonjs = 'js-codemod-ewnd9/transforms/import-to-commonjs.js';
const redux = 'js-codemod-ewnd9/transforms/redux-replace-switch.js';

export default () => {
  atom.commands.add('atom-workspace', {
    'jscodeshift:defaut': () => run(defaultTransforms),
    'jscodeshift:import': () => run([commonjsToImport]),
    'jscodeshift:commonjs': () => run([importToCommonjs]),
    'jscodeshift:redux-replace-switch': () => run([redux])
  });
};

function run(transforms) {
  const pane = atom.workspace.getActivePane();
  const editor = pane.getActiveEditor();
  const file = editor.buffer.file.path;

  const promises = transforms
    .map(t => {
      const args = [
        '-t',
        `${process.env.HOME}/dotfiles/scripts/codemod/${t}`,
        file
      ];

      return () => spawnPromise(`jscodeshift`, args, t);
    });

  promises
    .reduce(
      (total, curr) => total.then(() => curr()),
      Promise.resolve()
    );
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
