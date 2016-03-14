export default ($stateProvider, $urlRouterProvider) => {
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('main', {
      url: '/',
      template: '<main></main>'
    })
    .state('menu', {
      url: '/menu',
      template: '<menu></menu>'
    });
};
