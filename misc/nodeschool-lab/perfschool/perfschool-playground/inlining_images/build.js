'use strict';

var fs = require('fs');
var cheerio = require('cheerio');
var DataURI = require('datauri').promise;

var $ = cheerio.load(fs.readFileSync('./index-src.html', 'utf-8'));

var promises = $('img').map(function(i, elem) {
  var src = elem.attribs.src;

  if (src === '/hodor.jpg') {
    return Promise.resolve();
  } else {
    return DataURI(__dirname + src)
      .then(content => {
        elem.attribs.src = content;
      });
  }
});

Promise
  .all(promises.get())
  .then(result => {
    fs.writeFileSync('./index.html', $.html(), 'utf-8');
  })
  .catch(err => console.log(err.stack || err));
