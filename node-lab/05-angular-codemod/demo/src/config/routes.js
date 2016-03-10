export default ($stateProvider, $urlRouterProvider) => {
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('main', {
      url: '/',
      template: '<main></main>'
    })
    .state('about', {
      url: '/about',
      template: '<about></about>',
    });
};
