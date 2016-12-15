// https://github.com/babel/babel/blob/master/packages/babel-plugin-transform-es2015-shorthand-properties/src/index.js

'use strict';

const src = `
  async function test() {
    return await promiseFn();
  };
`;

require('../print-code')(src, ['babel-plugin-transform-async-to-generator', 'babel-plugin-transform-runtime']);

/*
// probably https://github.com/babel/babel/blob/master/packages/babel-helper-remap-async-to-generator/src/index.js

import _asyncToGenerator from "babel-runtime/helpers/asyncToGenerator";

let test = (() => {
  var ref = _asyncToGenerator(function* () {
    return yield promiseFn();
  });

  return function test() {
    return ref.apply(this, arguments);
  };
})();

;
*/
