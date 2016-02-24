const remark = require('remark');
const visit = require('unist-util-visit');
const pkg = require('./package.json');

const toArray = deps => Object.keys(pkg[deps]).reduce((total, key) => {
  total.push({ key, version: pkg[deps][key] });
  return total;
}, []);

const deps = toArray('dependencies').concat(toArray('devDependencies'));

exports = function transform() {
  return function (ast) {
    visit(ast, function(node) {
      if (node.type === 'inlineCode') {
        const dep = deps.find(_ => _.key === node.value);
        if (dep) {
          node.value = `${node.value}@${dep.version}`;
        }
      }
    });
  };
};

const result = remark().use(exports).process('`remark`');
console.log(result); //=> '`remark@^4.1.1`'
