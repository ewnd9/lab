module.exports = function(t, fn) {
  return {
    type: 'ArrayExpression',
    elements: fn.params.map(_ => t.stringLiteral(_.name)).concat(fn)
  };
};
