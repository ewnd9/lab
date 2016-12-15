'use strict';

const npmUserPackages = require('npm-user-packages');

// https://www.npmjs.com/~ewnd9
// https://github.com/sindresorhus/package-json

npmUserPackages('ewnd9')
  .then(data => {
    data.forEach(pkg => {
      console.log(`${pkg.name} ${pkg.version}`);
    });
    console.log(data.length);
  });
