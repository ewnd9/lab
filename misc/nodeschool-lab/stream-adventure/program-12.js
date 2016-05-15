'use strict';

var combine = require('stream-combiner');
var through = require('through2');
var split = require('split');
var zlib = require('zlib');

module.exports = function() {
  var result;

  var stream = through(function(buffer, encoding, next) {
    if (buffer.length === 0) {
      next();
      return;
    }
    
    var obj = JSON.parse(buffer);

    if (obj.type === 'genre') {
      if (result) {
        this.push(JSON.stringify(result) + '\n');
      }

      result = { name: obj.name, books: [] };
    } else if (obj.type === 'book') {
      result.books.push(obj.name);
    }

    next();
  }, function(done) {
    if (result) {
      this.push(JSON.stringify(result) + '\n');
    }

    done();
  });

  return combine(
    split(),
    stream,
    zlib.createGzip()
  );
};
