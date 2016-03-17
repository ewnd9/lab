'use strict';

module.exports = (src, transform) => {
  const result = require('babel-core').transform(src, {
    plugins: [transform]
  });

  console.log(result.code);
};
