import React from 'react';
import { renderToString } from 'react-dom/server';
import { RouterContext, createMemoryHistory, match } from 'react-router';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import { trigger } from 'redial';

import routes from './routes';
import configureStore from './configure-store';

export default path => new Promise((resolve, reject) => {
  const store = configureStore();
  const { dispatch, getState } = store;

  const history = createMemoryHistory(path);
  console.log(path)

  match({ routes, history }, (err, redirectLocation, renderProps) => {
    if (err) {
      throw err;
    };

    const { components } = renderProps;

    const locals = {
      path: renderProps.location.pathname,
      query: renderProps.location.query,
      params: renderProps.params,
      dispatch
    };

    trigger('fetch', components, locals)
      .then(() => {
        const state = getState();
        const html = renderToString(
          <Provider store={store}>
            <RouterContext {...renderProps} />
          </Provider>
        );

        resolve({ html, state });
      })
      .catch(reject);
  });
});
