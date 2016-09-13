# Testing dead code elimination

```js
if (process.env.NODE_ENV === 'production') {
  console.log('env', require('./a'));
} else {
  console.log('env', require('./b'));
}
```

I expect bundler to leave only `./a` dependency and don't include `./b` at all.

Right now only `webpack` (with [`DefinePlugin`](https://github.com/webpack/docs/wiki/list-of-plugins#defineplugin)) example is working correctly

`browserify` example includes `envify` and `uglifyify`

`rollup` example includes `rollup-plugin-replace`

## browserify

```sh
$ npm run build:browserify

$ grep "dependency-a" dist/bundle.browserify.js

"use strict";module.exports="dependency-a";

$ grep "dependency-b" dist/bundle.browserify.js

"use strict";module.exports="dependency-b"; # shouldn't be founded
```

## webpack

```sh
$ npm run build:webpack

$ grep "dependency-a" dist/bundle.webpack.js
module.exports = 'dependency-a';

$ grep "dependency-b" dist/bundle.webpack.js
$ echo $? #=> 1, not found, this is expected behavior
```

## rollup

```sh
$ npm run build:rollup
$ grep "dependency-a" dist/bundle.rollup.js
module.exports = 'dependency-a';
$ grep "dependency-b" dist/bundle.rollup.js
$ module.exports = 'dependency-b'; # shouldn't be founded
```
