'use strict';

const remark = require('remark');
const remarkHtml = require('remark-html');
const visit = require('unist-util-visit');
const fs = require('fs');

const data = fs.readFileSync('./readline.markdown', 'utf-8');

let originalAst;
const xs = [];

function transform(remark, i, j) {
  return function(ast) {
    if (!originalAst) {
      originalAst = ast;

      ast.children.forEach((node, i) => {
        if (node.type === 'heading') {
          xs.push({ depth: node.depth, index: i, node });
        }
      });
    }

    if (i) {
      ast.children = ast.children.slice(i, j);
    }
  };
};

remark().use(transform).use(remarkHtml).process(data);

for (let i = 0 ; i < xs.length ; i++) {
  let found;

  for (let j = i + 1 ; j < xs.length ; j++) {
    if (xs[i].depth === xs[j].depth) {
      found = j;
      break;
    } else if (xs[j].depth > xs[i].depth) {
      found = j;
    }
  }

  xs[i].begin = xs[i].index;// + 1;
  xs[i].end = found ? xs[found].index : undefined;
};

for (let i = 0 ; i < xs.length ; i++) {
  if (xs[i].depth === 2) {
    console.log('###');// + xs[i].node.children[0].value);
    console.log(remark().use(transform, xs[i].begin, xs[i].end).use(remarkHtml).process(data));
  }
};

/*
const escapedText = text.toLowerCase().replace(/[^\wА-Яа-я]+/g, '-')
const id = `anchor-${escapedText}`
const url = `#${id}`

// Collect note `h2` headers
if (level === 2) {
  h2s.push({
    name: text,
    url: url
  })
}

return `<h${level} id="${id}"><a href="${url}"></a>${text}</h${level}>`
*/
