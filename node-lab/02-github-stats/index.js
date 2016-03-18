'use strict';

const fs = require('fs');
const semverSort = require('semver-sort');

const result = {};

function processDeps(project, deps) {
  Object.keys(deps || {}).forEach(dep => {
    const v = deps[dep];

    if (!result[dep]) {
      result[dep] = {};
    }

    if (!result[dep][v]) {
      result[dep][v] = [];
    }

    result[dep][v].push(project);
  });
};

function printResult() {
  const report = [];

  Object.keys(result).sort().forEach(mod => {
    report.push(mod);

    // https://github.com/ragingwind/semver-sort/issues/2

    let sortedKeys = Object.keys(result[mod]);

    try {
      sortedKeys = semverSort.asc(sortedKeys);
    } catch (e) {
      console.log(`can't sort ${JSON.stringify(sortedKeys)} for "${mod}"`);
    }

    sortedKeys.forEach(v => {
      report.push('  ' + v);

      result[mod][v].forEach(project => {
        report.push('    ' + project);
      });
    });
  });

  report.push('');
  fs.writeFileSync(__dirname + '/report.txt', report.join('\n'), 'utf-8');
};

fs.readdirSync('./data').forEach(file => {
  if (fs.lstatSync('./data/' + file).isDirectory()) {
    const body = JSON.parse(fs.readFileSync('./data/' + file + '/package.json'));
    const dependencies = body.dependencies;
    const devDependencies = body.devDependencies;

    processDeps(file, dependencies);
    processDeps(file, devDependencies);
  }
});

printResult();
