import annotateFn from './annotate-fn';

export default function({ types: t }) {
  function annotate(path) {
    if (path.parent.type === 'ObjectProperty' &&
        path.parent.key.name === 'controller' &&
        path.parentPath.parent.type === 'ObjectExpression' &&
        path.parentPath.parentPath.parent.type === 'ExportDefaultDeclaration') {
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
