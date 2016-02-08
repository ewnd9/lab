var through = require('through2');
var trumpet = require('trumpet');
var tr = trumpet();

var stream = tr.select('.loud').createStream();
stream.pipe(through(function(buffer, _, next) {
  this.push(buffer.toString().toUpperCase());
  next();
})).pipe(stream);

process.stdin.pipe(tr).pipe(process.stdout)

