import annotateFn from './annotate-fn';

export default function({ types: t }) {
  const visitorArrowFn = {
    ArrowFunctionExpression(path) {
      if (path.parent === this.parentNode) {
        path.replaceWith(annotateFn(t, path.node));
      }
    }
  };

  const visitor0 = {
    VariableDeclaration(path) {
      if (path.parent === this.parentNode) {
        path.traverse(visitor1, { parentNode: path.node });
      }
    }
  };

  const visitor1 = {
    VariableDeclarator(path) {
      if (path.parent === this.parentNode) {
        path.traverse(visitor2, { parentNode: path.node });
      }
    }
  };

  const visitor2 = {
    ArrowFunctionExpression(path) {
      if (path.parent === this.parentNode) {
        path.replaceWith(annotateFn(t, path.node));
      }
    }
  };

  return {
    visitor: {
      ExportNamedDeclaration(path) {
        path.traverse(visitor0, { parentNode: path.node });
      },
      ExportDefaultDeclaration(path) {
        path.traverse(visitorArrowFn, { parentNode: path.node });
      }
    }
  };
}
