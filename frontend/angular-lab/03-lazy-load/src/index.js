import angular from 'angular';
import 'bootstrap/dist/css/bootstrap.css';

import 'oclazyload';

const appName = 'myApp';
const app = angular.module(appName, [
  require('angular-ui-router'),
  require('./containers/common').default,
  'oc.lazyLoad'
]);

app.config(require('./routes').default);

angular.element(document).ready(function() {
  angular.bootstrap(document, [appName]);
});
