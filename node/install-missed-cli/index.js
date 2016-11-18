'use strict';

const check = require('dependency-check');
const inquirer = require('inquirer');
const execSync = require('child_process').execSync;

check({ path: process.cwd() + '/package.json', missing: true }, function(err, res) {
  const pkg = res.package
  const deps = res.used;

  const missed = check.missing(pkg, deps);

  inquirer
    .prompt(missed.map(inquirerPrompt))
    .then(res => {
      const filt = val => Object.keys(res).filter(key => res[key] === val);
      const save = filt('save');
      const saveDev = filt('saveDev');

      if (save.length > 0) {
        const saveCmd = `npm install -S ${save.join(' ')}`;
        console.log(saveCmd);
        execSync(saveCmd);
      }

      if (saveDev.length > 0) {
        const saveDevCmd = `npm install -D ${saveDev.join(' ')}`;
        console.log(saveDevCmd);
        execSync(saveDevCmd);
      }
    })
    .catch(err => console.log(err.stack || err));
})

function inquirerPrompt(mod) {
  return {
    type: 'list',
    name: mod,
    choices: ['save', 'saveDev'],
    message: mod
  };
}

// inquirerPrompt('x')
//   .then(() => inquirerPrompt('y'));
