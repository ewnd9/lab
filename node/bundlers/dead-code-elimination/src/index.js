'use strict';

if (process.env.NODE_ENV === 'production') {
  console.log('env', require('./a'));
} else {
  console.log('env', require('./b'));
}
