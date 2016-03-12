import Router from 'routes/index';

import { h } from 'virtual-dom';
import hyperx from 'hyperx';
const hx = hyperx(h);

const router = Router();
export default router;

import Main from './components/main';
import Contact from './components/contact';
import About from './components/about';

const routes = {
  '/': Main,
  '/about': About,
  '/contact': Contact
};

Object.keys(routes).forEach(route => {
  router.addRoute(route, function(m) {
    return layout(m.state, routes[route]());
  });
});

function layout(state, page) {
  const titles = {
    '/': 'home',
    '/about': 'about',
    '/contact': 'contact'
  };

  return hx`<div>
    <h1>${titles[state.path]}</h1>
    <div class="links">
      ${ Object.keys(titles).map(href => {
        return hx`<a class="${state.path === href && '.active' || ''}" href="${href}">
          ${titles[href]}
        </a>`;
      }) }
      ${ page }
    </div>
  </div>
  `;
};
