import annotateFn from './annotate-fn';

export default function({ types: t }) {
  const visitorFn = {
    ArrowFunctionExpression(path) {
      if (path.parent === this.parentNode) {
        path.replaceWith(annotateFn(t, path.node));
      }
    }
  };

  const visitorOne = {
    ObjectProperty(path) {
      if (path.parent === this.parentNode && path.node.key.name === 'controller') {
        path.traverse(visitorFn, { parentNode: path.node });
      }
    }
  };

  return {
    visitor: {
      ObjectExpression(path) {
        if (path.parent.type === 'ExportDefaultDeclaration') {
          path.traverse(visitorOne, { parentNode: path.node });
        }
      }
    }
  };
}
