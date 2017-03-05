'use strict';

const fs = require('fs');
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch');
const getStream = require('get-stream');
const path = require('path');

Promise
  .all([
    cmp('images/record-desktop.before.png', 'images/record-desktop.after.png', 'images/record-desktop.diff.1.png'),
    cmp('images/record-desktop.before.png', 'images/record-desktop.before.png', 'images/record-desktop.diff.2.png')
  ])
  .catch(err => console.log(err.stack || err));

function cmp(img1Url, img2Url, imgDiffUrl) {
  console.log('start')
  return Promise
    .all([
      readPng(img1Url),
      readPng(img2Url)
    ])
    .then(([ img1, img2 ]) => {
      const diff = new PNG({width: img1.width, height: img1.height});
      const diffCount = pixelmatch(img1.data, img2.data, diff.data, img1.width, img1.height, {threshold: 0.1});

      console.log(img1Url, img2Url, 'diffCount', diffCount);

      return new Promise((resolve, reject) => {
        const s = diff.pack().pipe(fs.createWriteStream(imgDiffUrl));
        s.on('finish', resolve);
        s.on('error', reject);
      });
    });
}

function readPng(url) {
  return new Promise((resolve, reject) => {
     const img = fs.createReadStream(url).pipe(new PNG());
     img.on('parsed', () => resolve(img));
     img.on('error', reject);
  });
}
