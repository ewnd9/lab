import angular from 'angular';

const name = 'common';

const module = angular.module(name, []);
module.component('profile', require('./components/profile/profile').default);

export default name;
