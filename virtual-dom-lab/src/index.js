import vDom, { h } from 'virtual-dom';
import xtend from 'xtend';

import main from 'main-loop';
import router from './routes';

import singlePage from 'single-page';
import catchLinks from 'catch-links';

const state = {
  path: location.pathname
};

const loop = main(state, render, vDom);

const target = document.querySelector('#content');
target.parentNode.replaceChild(loop.target, target);

const show = singlePage(function (href) {
  loop.update(xtend({ path: href }));
});

catchLinks(window, show);

function render (state) {
  const m = router.match(state.path);

  if (!m) {
    return h('div.error', 'not found');
  } else {
    return m.fn(xtend(m, { state: state }));
  }
};

require('./websocket-client');
