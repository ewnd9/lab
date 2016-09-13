function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var a = createCommonjsModule(function (module) {
'use strict';

module.exports = 'dependency-a';
});

var b = createCommonjsModule(function (module) {
'use strict';

module.exports = 'dependency-b';
});

var index = createCommonjsModule(function (module) {
'use strict';

{
  console.log('env', a);
}
});

export default index;