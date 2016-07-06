'use strict';

var fs = require('fs');
var got = require('got');
var path = require('path');
var jpegtran = require('jpegtran');
var optipng = require('optipng');
var gifsicle = require('gifsicle')
var gm = require('gm').subClass({ imageMagick: true });

var images = fs
  .readFileSync('./images.txt', 'utf-8')
  .trim()
  .split('\n');

var downloaded = 0;

var promises = images
  .map(function(image, i) {
    var ext = path.extname(image);

    return new Promise(function(resolve, reject) {
      var downloadStream = got.stream(image);
      gm(downloadStream, image)
        .resize('200', '200')
        .stream()
        .pipe(fs.createWriteStream(`./public/img-${i}${ext}`))
        .on('error', reject)
        .on('finish', function() {
          downloaded++;
          console.log(`downloaded: ${downloaded}`);

          resolve();
        })
    });
  });

Promise
  .all(promises)
  .catch(err => console.log(err.stack || err));
