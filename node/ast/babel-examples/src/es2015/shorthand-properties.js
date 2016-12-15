// https://github.com/babel/babel/blob/master/packages/babel-plugin-transform-es2015-shorthand-properties/src/index.js

'use strict';

const src = `
  const obj = {
    method() {

    }
  };
`;

require('../print-code')(src, 'transform-es2015-shorthand-properties');

/*
const obj = {
  method: function () {}
};
*/
