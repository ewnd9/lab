var http = require('http');
var fs = require('fs');
var through = require('through2');

function write(buffer, _, next) {
  this.push(buffer.toString().toUpperCase());
  next()
}

var server = http.createServer(function (req, res) {
  if (req.method === 'POST') {
    req.pipe(through(write)).pipe(res);
  }
});
server.listen(process.argv[2]);
