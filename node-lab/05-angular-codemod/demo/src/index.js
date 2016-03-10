import angular from 'angular';

const app = angular.module('app', []);
app.component('main', require('./components/main/main').default);
