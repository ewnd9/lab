module.exports = function(t, _fn) {
  const fn = t.functionExpression(null, _fn.params, _fn.body);
  // fn.type = 'FunctionExpression';

  return t.arrayExpression(
    fn.params.map(_ => t.stringLiteral(_.name)).concat(fn)
  );
};
