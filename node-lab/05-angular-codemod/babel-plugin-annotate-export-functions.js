import annotateFn from './annotate-fn';

export default function({ types: t }) {
  function annotate(path) {
    if (path.parent.type === 'ExportDefaultDeclaration' || (
      path.parent.type === 'VariableDeclarator' &&
      path.parentPath.parent.type === 'VariableDeclaration' &&
      path.parentPath.parentPath.parent.type === 'ExportNamedDeclaration'
    )) {
      path.replaceWith(annotateFn(t, path.node));
    }
  };

  return {
    visitor: {
      FunctionExpression: annotate,
      ArrowFunctionExpression: annotate
    }
  };
}
