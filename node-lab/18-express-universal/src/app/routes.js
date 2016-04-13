import React from 'react';
import { Router, Route, Link, IndexRoute, browserHistory } from 'react-router';

import Main from './components/main';

const routes = (<Router>
  <Route path="/" component={Main}></Route>
</Router>);

export default routes;
