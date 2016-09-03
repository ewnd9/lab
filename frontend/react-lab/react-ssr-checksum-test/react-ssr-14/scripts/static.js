import React from 'react';

import { renderToString } from 'react-dom/server';
import { match, createMemoryHistory, RouterContext, RouteUtils } from 'react-router';
import { createRoutesFromReactChildren } from 'react-router/lib/RouteUtils';

import { App, rootId, routes } from '../app/app';

import fs from 'fs';
import http from 'http';
import mkdirp from 'mkdirp';

const dist = './dist';
const html = fs.readFileSync(`${dist}/index.html`, 'utf-8');

getAllRoutes(routes)
  // .forEach(({ path, file, dir }) => {
  .forEach(path => {
    console.log(path)
    // const history = createMemoryHistory(path);
    //
    // match({ routes, history }, (err, redirectLocation, renderProps) => {
    //   if (err) {
    //     throw err;
    //   }
    //
    //   const reactMarkup = renderToString(<RouterContext {...renderProps} />);
    //   const page = html.replace(`<div id="${rootId}"></div>`, `<div id="${rootId}">${reactMarkup}</div>`)
    //
    //   mkdirp.sync(`${dist}${dir}`);
    //   fs.writeFile(`${dist}/${dir}/index.html`, page);
    //   // fs.writeFile(`${dist}/${file}`, page);
    // });
  });

function getAllRoutes(routes) {
  return h(routes, '', []);

  function h(root, parent, acc) {
    let currPath = parent;

    if (root.props && root.props.path) {
      currPath = parent + root.props.path;
      acc.push(currPath);
    }

    if (root.props && root.props.children) {
      if (Array.isArray(root.props.children)) {
        root.props.children.forEach(child => {
          h(child, currPath, acc);
        });
      } else {
        h(root.props.children, currPath, acc);
      }
    }

    return acc;
  }
}

// function getAllRoutes(routes) {
//
//   // console.log(routes.props.children.props.path); //=> '/'
//   // console.log(routes.props.children.props.children[0].type.displayName); //=> 'IndexRoute'
//   // console.log(routes.props.children.props.children[1].props.path); //=> '/about'
//
//   return [{
//     path: '/',
//     dir: '',
//     file: 'index.html'
//   }, {
//     path: '/about',
//     dir: '/about',
//     file: 'about.html'
//   }];
// }
