what will happen if I use node 4+ library dependency with webpack

example: library contains const keyword

expectations: node_modules directory is in babel ignore, so there would be const in dist bundle and an web app would fail on old browsers

result:

```js
webpackJsonp([1],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _es6Dependency = __webpack_require__(1);

	var _es6Dependency2 = _interopRequireDefault(_es6Dependency);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var y = _es6Dependency2.default;
	console.log(_es6Dependency2.default, y);

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	const x = 1;
	module.exports = x;


/***/ }
]);
//# sourceMappingURL=app.bundle.367743d73190d475cd75.js.map
```

`const` is presented, it may cause troubles
