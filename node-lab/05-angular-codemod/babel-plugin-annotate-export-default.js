import annotateFn from './annotate-fn';

export default function({ types: t }) {
  return {
    visitor: {
      ExportDefaultDeclaration(path) {
        if (path.node.declaration.type === 'ObjectExpression') {
          path.node.declaration.properties.forEach(property => {
            if (property.key.name === 'controller') {
              property.value = annotateFn(t, property.value);
            }
          });
        }
      }
    }
  };
}
