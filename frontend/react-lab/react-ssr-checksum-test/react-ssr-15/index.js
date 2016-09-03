'use strict';

import React from 'react';
import { renderToString } from 'react-dom/server';

const App = React.createClass({
  render() {
    return (
      <div>
        hello
      </div>
    );
  }
});


console.log(renderToString(<App />));
