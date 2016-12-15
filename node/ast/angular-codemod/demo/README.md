# demo

Two simple components + `angular-ui-router`

It's working (altough only with arrow functions as exports, more in the `notes` section).

Without minification: `1.33 MB`

With minification: `197 kB`

## Install

```
$ npm install
$ npm link babel-plugin-annotate-export-default
$ npm link babel-plugin-annotate-export-functions
```

## Usage

```
$ npm start # watch mode non-minified
$ npm run build # build minified to dist
```

## Test

```
$ babel --plugins babel-plugin-annotate-export-default src/components/main/main.js
$ babel --plugins babel-plugin-annotate-export-functions src/config/routes.js
```

## Notes

:warning: Somehow working only with arrow functions (`ArrowFunctionExpression`),
probably because defined proper functions types are `FunctionDeclaration`, where I was think
it would be `FunctionExpression`
