var recast = require('recast');
var babel = require('babel-core');
var j = require('jscodeshift');

module.exports = (code, transform) => {
  var ast = recast.parse(code, {
    sourceFileName: 'source.js',
    esprima: babel
  });

  var r = j(ast)
    .find(j.ObjectExpression)
    .filter(p => p.parent.value.type === 'ExportDefaultDeclaration')
    .replaceWith(p => {
      return transform(p).node;
    });

  var options = {
    sourceMapName: 'source.js.map'
  };

  var print = (ast) => {
    if (ast._parent) {
      return print(ast._parent, options);
    }
    if (ast.__paths.length === 1) {
      return recast.print(ast.__paths[0], options);
    } else {
      return ast.__paths.map(function (p) {
        return recast.print(p, options);
      });
    }
  };

  return print(r);
};
