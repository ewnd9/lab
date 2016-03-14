var spawn = require('child_process').spawn;
var duplexer = require('duplexer2');

module.exports = function(cmd, args) {
  var p = spawn(cmd, args);
  return duplexer(p.stdin, p.stdout)
};
