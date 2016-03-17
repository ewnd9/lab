'use strict';

module.exports = (src, transform) => {
  const result = require('babel-core').transform(src, {
    plugins: Array.isArray(transform) ? transform : [transform]
  });

  console.log(result.code);
};
