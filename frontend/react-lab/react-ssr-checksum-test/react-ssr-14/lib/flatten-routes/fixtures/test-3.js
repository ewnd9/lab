import React from 'react';
import { Router, Route, IndexRoute, Redirect } from 'react-router';

const App = () => (<div>app</div>);

export const routes = (
  <Router>
    <Route path="/" component={App}>
      <Route path="about" component={App}/>
      <Route path="users" component={App}>
        <Route path="/user/:userId" component={App}/>
      </Route>
      <Route path="*" component={App}/>
    </Route>
  </Router>
);
