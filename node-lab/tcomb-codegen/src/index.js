'use strict';

const j = require('jscodeshift');

const e = j.template.expression;
const s = j.template.statement;

module.exports = function(input) {
  const tcombCode = genT([input])[0].node;
  const root = j(j.file(j.program([j.expressionStatement(tcombCode)])));

  return root.toSource({ quote: 'single' });
};

function genT(items) {
  const result = [];

  for (const root of items) {
    if (Array.isArray(root)) {
      const list = e`t.list()`;
      const children = genT(root);

      if (children.length === 0) {
        list.arguments.push(Primitive('Any'));
      } else {
        const uniqueTypes = children.reduce((total, curr) => { total[curr.type] = true; return total; }, {});

        if (Object.keys(uniqueTypes).length === 1) {
          list.arguments.push(children[0].node);
        } else {
          const union = e`t.union([])`;
          const elements = union.arguments[0].elements

          elements.push.apply(elements, children.map(_ => _.node));
          list.arguments.push(union);
        }
      }

      result.push({ node: list, type: 'list' });
    } else if (typeof root === 'object') {
      const struct = e`t.struct({})`;

      const props = Object
        .keys(root)
        .forEach(key => {
          const result = genT([root[key]])[0];

          struct.arguments[0].properties.push(
            j.property('init', j.identifier(key), result.node)
          );
        });

      result.push({ node: struct, type: 'struct' });
    } else if (typeof root === 'number') {
      result.push(PrimitiveNode('Number'));
    } else if (typeof root === 'string') {
      result.push(PrimitiveNode('String'));
    } else if (typeof root === 'boolean') {
      result.push(PrimitiveNode('Boolean'));
    } else {
      console.log('unknown', result)
    }
  }

  return result;
}

function PrimitiveNode(type) {
  return { node: Primitive(type), type };
}

function Primitive(type) {
  return j.memberExpression(j.identifier('t'), j.identifier(type));
}
