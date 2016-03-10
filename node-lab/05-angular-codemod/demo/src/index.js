import angular from 'angular';
import uiRouter from 'angular-ui-router';

const app = angular.module('app', [uiRouter]);

app.component('main', require('./components/main/main').default);
app.component('about', require('./components/about/about').default);

app.config(require('./config/routes.js').default);
