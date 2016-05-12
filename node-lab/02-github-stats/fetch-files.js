'use strict';

const ghGot = require('gh-got');
const got = require('got');

const pify = require('pify');
const fs = require('fs');

const writeFile = pify(fs.writeFile);
const readFile = pify(fs.readFile);

const mkdirp = pify(require('mkdirp'));

const delay = timeout => new Promise(resolve => setTimeout(resolve, timeout));

const cacheFilePath = './data/info.json';

readFile(cacheFilePath, 'utf-8')
  .then(file => {
    return JSON.parse(file);
  }, err => {
    return {
      cache: {},
      descriptions: {}
    };
  })
  .then(file => {
    return loadPage(file, 1);
  })
  .then(file => writeFile(cacheFilePath, JSON.stringify(file, null, 2), 'utf-8'))
  .catch(err => console.log(err, err.stack));

function loadPage(file, page) {
  return ghGot(`users/ewnd9/repos?page=${page}`)
    .then(res => Promise
      .all(res.body.map((r, i) => {
        if (r.fork) {
          return Promise.resolve();
        }

        file.descriptions[r.name] = r.description;

        if (file.cache[r.name] !== r.pushed_at) {
          file.cache[r.name] = r.pushed_at;
          return loadRepository(r, i);
        } else {
          console.log(`"${r.name}" have not changed from previous fetch`);
          return Promise.resolve();
        }
      }))
      .then(() => {
        if (res.body.length === 30) {
          console.log(`processing ${page} page`);
          return loadPage(file, page + 1);
        } else {
          console.log('finish');
          return Promise.resolve(file);
        }
      })
    );
};

function loadRepository(r, i) {
  const url = `https://raw.githubusercontent.com/${r.full_name}/master/package.json`;

  return delay(i * 100)
    .then(() => got(url))
    .then(res => {
      const body = JSON.parse(res.body);

      return mkdirp(`./data/${r.name}`)
        .then(() => writeFile(`./data/${r.name}/package.json`, res.body, 'utf-8'));
    }, err => {
      if (err.statusCode !== 404) {
        throw err;
      }
    });
}
