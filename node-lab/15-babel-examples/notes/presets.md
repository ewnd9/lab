## stage-0

```js
module.exports = {
  presets: [
    require("babel-preset-stage-1")
  ],
  plugins: [
    require("babel-plugin-transform-do-expressions"),
    require("babel-plugin-transform-function-bind")
  ]
};
```

## stage-1

```js
// https://github.com/babel/babel/blob/master/packages/babel-preset-stage-1/index.js
module.exports = {
  presets: [
    require("babel-preset-stage-2")
  ],
  plugins: [
    require("babel-plugin-transform-class-constructor-call"),
    require("babel-plugin-transform-class-properties"),
    require("babel-plugin-transform-decorators"),
    require("babel-plugin-transform-export-extensions")
  ]
};
```

## stage-2

```js
// https://github.com/babel/babel/blob/master/packages/babel-preset-stage-2/index.js
module.exports = {
  presets: [
    require("babel-preset-stage-3")
  ],
  plugins: [
    require("babel-plugin-syntax-trailing-function-commas"),
    require("babel-plugin-transform-object-rest-spread")
  ]
};
```

## stage-3

```js
// https://github.com/babel/babel/blob/master/packages/babel-preset-stage-3/index.js
module.exports = {
  plugins: [
    require("babel-plugin-transform-async-to-generator"),
    require("babel-plugin-transform-exponentiation-operator")
  ]
};
```

## es-2015

```js
// https://github.com/babel/babel/blob/master/packages/babel-preset-es2015/index.js
module.exports = {
  plugins: [
    require("babel-plugin-transform-es2015-template-literals"),
    require("babel-plugin-transform-es2015-literals"),
    require("babel-plugin-transform-es2015-function-name"),
    require("babel-plugin-transform-es2015-arrow-functions"),
    require("babel-plugin-transform-es2015-block-scoped-functions"),
    require("babel-plugin-transform-es2015-classes"),
    require("babel-plugin-transform-es2015-object-super"),
    require("babel-plugin-transform-es2015-shorthand-properties"),
    require("babel-plugin-transform-es2015-duplicate-keys"),
    require("babel-plugin-transform-es2015-computed-properties"),
    require("babel-plugin-transform-es2015-for-of"),
    require("babel-plugin-transform-es2015-sticky-regex"),
    require("babel-plugin-transform-es2015-unicode-regex"),
    require("babel-plugin-check-es2015-constants"),
    require("babel-plugin-transform-es2015-spread"),
    require("babel-plugin-transform-es2015-parameters"),
    require("babel-plugin-transform-es2015-destructuring"),
    require("babel-plugin-transform-es2015-block-scoping"),
    require("babel-plugin-transform-es2015-typeof-symbol"),
    require("babel-plugin-transform-es2015-modules-commonjs"),
    [require("babel-plugin-transform-regenerator"), { async: false, asyncGenerators: false }],
  ]
};
```
