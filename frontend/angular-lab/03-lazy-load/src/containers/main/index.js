import angular from 'angular';

const name = 'main';

const app = angular.module(name, []);

app.component('main', require('./components/main/main').default);
app.component('list', require('./components/list/list').default);

export default name;
