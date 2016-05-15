'use strict';

var spawn = require('child_process').spawn;
var duplexer = require('duplexer2');

module.exports = function (cmd, args) {
  var child = spawn(cmd, args);
  return duplexer(child.stdin, child.stdout);
};
