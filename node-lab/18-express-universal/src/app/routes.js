import React from 'react';
import { Router, Route, Link, IndexRoute, browserHistory } from 'react-router';

import Shell from './components/shell/shell';
import Main from './components/main/main';
import Category from './components/category/category';

const routes = (<Router>
  <Route path="/" component={Shell}>
    <IndexRoute component={Main}></IndexRoute>
    <Route path="/category/:id" component={Category}></Route>
  </Route>
</Router>);

export default routes;
