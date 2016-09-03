import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';

import App from './components/app/app';
import About from './components/about/about';

const routes = (
  <Router>
    <Route path="/">
      <IndexRoute component={App}></IndexRoute>
      <Route path="/about" component={About}></Route>
    </Route>
  </Router>
);

export default routes;
