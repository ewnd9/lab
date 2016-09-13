'use strict';

import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';

export default {
  entry: './src/index.js',
  plugins: [
    commonjs(),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    })
  ],
  targets: [
    {
      dest: './dist/bundle.rollup.js',
      format: 'es'
    }
  ]
};
