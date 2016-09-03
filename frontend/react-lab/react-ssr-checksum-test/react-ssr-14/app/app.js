import React from 'react';
import { Router, browserHistory } from 'react-router';

import _routes from './routes';
export const routes = _routes;

export const App = () => (
  <Router history={browserHistory} routes={routes} />
);

export const rootId = 'root';
