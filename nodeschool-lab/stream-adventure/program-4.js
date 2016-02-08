var through = require('through2');
var split = require('split');

var i = 0;

var stream = through(function(buffer, encoding, next) {
  var str = buffer.toString();
  str = (i++ % 2 === 1) ? str.toUpperCase() : str.toLowerCase();
  this.push(str + '\n');
  next()
});

process.stdin.pipe(split()).pipe(stream).pipe(process.stdout);
