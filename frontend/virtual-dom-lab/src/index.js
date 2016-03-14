import vDom, { h } from 'virtual-dom';
import xtend from 'xtend';

import router from './routes';

import singlePage from 'single-page';
import catchLinks from 'catch-links';
import { init, bus, UPDATE_PATH } from './state';

const loop = init(render, vDom);

const target = document.querySelector('#content');
target.parentNode.replaceChild(loop.target, target);

const show = singlePage(href => bus.emit(UPDATE_PATH, href));
catchLinks(window, show);

function render(state) {
  const m = router.match(state.path);

  if (!m) {
    return h('div.error', 'not found');
  } else {
    return m.fn(xtend(m, { state }));
  }
};

require('./websocket-client');
