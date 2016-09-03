import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';

const App = () => (<div>app</div>);

export const routes = (
  <Router>
    <Route path="/">
      <IndexRoute component={App}></IndexRoute>
      <Route path="/about" component={App}></Route>
    </Route>
  </Router>
);
