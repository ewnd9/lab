var through = require('through2');
var concat = require('concat-stream');
var stream = through(function(buffer, encoding, next) {
  this.push(buffer.toString().reverse());
  next()
});

process.stdin.pipe(concat(function(body) {
  console.log(body.toString().split('').reverse().join(''));
}))
