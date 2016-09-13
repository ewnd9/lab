# Testing dead code elimination

## browserify

```sh
$ npm run build:browserify
$ cat dist/bundle.browserify.js

$ grep "dependency-a" dist/bundle.browserify.js

"use strict";module.exports="dependency-a";

$ grep "dependency-b" dist/bundle.browserify.js

"use strict";module.exports="dependency-b"; # shouldn't be founded
```

## webpack

```sh
$ npm run build:webpack
$ cat dist/bundle.webpack.js

$ grep "dependency-a" dist/bundle.webpack.js
module.exports = 'dependency-a';

$ grep "dependency-b" dist/bundle.webpack.js
$ echo $? #=> 1, not found, this is expected behavior
```
