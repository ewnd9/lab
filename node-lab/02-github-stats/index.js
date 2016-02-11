const ghGot = require('gh-got');
const got = require('got');
const fs = require('fs');

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
    Object.keys(result[mod]).forEach(v => {
      report.push('  ' + v);
      result[mod][v].forEach(project => {
        report.push('    ' + project);
      });
    });
  });

  report.push('');
  fs.writeFileSync(__dirname + '/report.txt', report.join('\n'), 'utf-8');
};

const delay = timeout => new Promise(resolve => setTimeout(resolve, timeout));
const promises = [];

const loadPage = page => ghGot(`users/ewnd9/repos?page=${page}`)
  .then(res => {
    res.body.forEach((r, i) => {
      if (r.fork) {
        return;
      }

      const url = `https://raw.githubusercontent.com/${r.full_name}/master/package.json`;

      promises.push(
        delay(i * 100)
        .then(() => got(url))
        .then(res => {
          const { dependencies, devDependencies } = JSON.parse(res.body);
          processDeps(r.full_name, dependencies);
          processDeps(r.full_name, devDependencies);
        }, err => {
          if (err.statusCode !== 404) {
            throw err;
          }
        })
      );
    });

    return Promise
      .all(promises)
      .then(() => {
        if (res.body.length === 30) {
          console.log(page + 1);
          return loadPage(page + 1);
        } else {
          printResult();
        }
      })
  });

loadPage(1).catch(err => console.log(err, err.stack));
