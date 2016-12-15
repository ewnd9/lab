'use strict';

const fs = require('fs');
const SourceMapConsumer = require('source-map').SourceMapConsumer;

const rawSourceMap = fs.readFileSync('./dist/code.js.map', 'utf-8');
const smc = new SourceMapConsumer(rawSourceMap);
console.log(JSON.stringify(JSON.parse(rawSourceMap), null, 2));

// console.log(smc.sources);
// // [ 'http://example.com/www/js/one.js',
// //   'http://example.com/www/js/two.js' ]
//
// console.log(smc.originalPositionFor({
//   line: 2,
//   column: 28
// }));
// // { source: 'http://example.com/www/js/two.js',
// //   line: 2,
// //   column: 10,
// //   name: 'n' }
//
// console.log(smc.generatedPositionFor({
//   source: 'http://example.com/www/js/two.js',
//   line: 2,
//   column: 10
// }));
// // { line: 2, column: 28 }
//
// smc.eachMapping(function (m) {
//   // console.log(m)
// });
