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

`browserify` has the `--exclude 'path/from/root/of/project'` option

```sh
$ npm run build:browserify:exclude

$ grep "dependency-a" dist/bundle.browserify.exclude.js

"use strict";module.exports="dependency-a";

$ grep "dependency-b" dist/bundle.browserify.exclude.js
$ echo $? #=> 1, not found, this is expected behavior
```

You could manually exclude certain dependencies if you now you have guareded them with
`if (process.env.NODE_ENV !== 'production')`, but tracking this kind of behaviour in
dependencies themself seems unpractical.

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
