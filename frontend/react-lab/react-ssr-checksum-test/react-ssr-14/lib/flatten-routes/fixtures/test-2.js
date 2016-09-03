import React from 'react';
import { Router, Route, IndexRoute, Redirect } from 'react-router';

const App = () => (<div>app</div>);

export const routes = (
  <Router>
    <Route path='/' component={App}>
      <Route path='/about' component={App} />
      <Route path='/inbox' component={App}>
        <Route path='/messages/:id' component={App} />
      </Route>
      <Redirect from="/about-us" to="/about" />
    </Route>
  </Router>
);
