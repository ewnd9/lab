import angular from 'angular';
import 'bootstrap/dist/css/bootstrap.css';

const appName = 'myApp';
const app = angular.module(appName, [
  require('angular-ui-router')
]);

app.component('main', require('./components/main/main').default);
app.component('menu', require('./components/menu/menu').default);

app.config(require('./routes').default);

angular.element(document).ready(function() {
  angular.bootstrap(document, [appName]);
});
