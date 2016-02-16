import annotateFn from './annotate-fn';

export default function({ types: t }) {
  return {
    visitor: {
      ExportNamedDeclaration(path) {
        if (path.node.declaration.type === 'VariableDeclaration' &&
            path.node.declaration.declarations[0].type === 'VariableDeclarator' &&
            path.node.declaration.declarations[0].init.type === 'ArrowFunctionExpression') {

          path.node.declaration.declarations[0].init = annotateFn(t, path.node.declaration.declarations[0].init);
        }
      },
      ExportDefaultDeclaration(path) {
        if (path.node.declaration.type === 'ArrowFunctionExpression') {
          path.node.declaration = annotateFn(t, path.node.declaration);
        }
      }
    }
  };
}
