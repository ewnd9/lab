// https://github.com/babel/babel/blob/master/packages/babel-plugin-transform-es2015-shorthand-properties/src/index.js

'use strict';

const src = `
  async function test() {
    return await promiseFn();
  };
`;

require('../print-code')(src, 'babel-plugin-transform-async-to-generator');

/*
let test = (() => {
  var ref = _asyncToGenerator(function* () {
    return yield promiseFn();
  });

  return function test() {
    return ref.apply(this, arguments);
  };
})();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }
*/

/*
// unminified first line

function _asyncToGenerator(fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new Promise(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value)
            .then(function (value) {
              return step("next", value);
            }, function (err) {
              return step("throw", err);
            });
        }
      }

      return step("next");
    });
  };
};
*/
