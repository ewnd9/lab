import angular from 'angular';

const name = 'menu';

const app = angular.module(name, []);

app.component('menu', require('./components/menu/menu').default);
app.component('list', require('./components/list/list').default);

export default name;
