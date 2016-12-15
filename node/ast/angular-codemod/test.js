var source = require('fs').readFileSync('example/01-two-arguments/source.js', 'utf-8');
var expected = require('fs').readFileSync('example/01-two-arguments/expected.js', 'utf-8');

var injectDeps = require('./inject-arguments');
var result = require('./transform')(source, injectDeps);

console.log(result.code === expected);

console.log(result.code);
console.log(result.map);
