import angular from 'angular';
// import 'bootstrap/dist/css/bootstrap.css';
import 'imports?angular=angular!restangular';
import 'imports?angular=angular!ng-admin';
import 'ng-admin/build/ng-admin.min.css';

import './fake-rest';

const appName = 'myApp';
const app = angular.module(appName, [
  require('angular-ui-router'),
  'restangular',
  'ng-admin'
]);

app.component('main', require('./components/main/main').default);
app.component('menu', require('./components/menu/menu').default);
app.component('send-post', require('./components/send-post/send-post').default);

app.directive('postLink', require('./directives/post-link').default);
app.directive('sendEmail', require('./directives/send-email').default);

app.config(require('./config/ng-admin').default);
app.config(require('./config/rest-angular').default);
app.config(require('./config/state').default);

angular.element(document).ready(function() {
  angular.bootstrap(document, [appName]);
});
