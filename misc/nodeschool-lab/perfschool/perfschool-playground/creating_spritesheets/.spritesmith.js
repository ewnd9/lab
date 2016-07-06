'use strict';

var util = require('util');

module.exports = {
  src: 'dist/icons/*',
  destImage: 'dist/icons.png',
  destCSS: 'dist/icons.css',
  cssOpts: {
    cssClass: function (item) {
      return util.format('.ic-%s:before', item.name);
    }
  }
};
