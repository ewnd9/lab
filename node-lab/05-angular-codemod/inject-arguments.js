module.exports = p => {
  const properties = p.node.properties;

  Object.keys(properties).forEach(property => {
    if (properties[property].key.name === 'controller') {
      const args = properties[property].value.params.map(v => ({
        type: 'Literal',
        value: v.name
      }));

      const fn = properties[property].value;

      properties[property].value = {
        type: 'ArrayExpression',
        elements: args.concat(fn)
      };
    }
  });

  return p;
};
