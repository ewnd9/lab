module.exports = function(t, fn) {
  return t.arrayExpression(
    fn.params.map(_ => t.stringLiteral(_.name)).concat(fn)
  );
};
