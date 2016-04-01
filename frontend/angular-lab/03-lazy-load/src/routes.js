import angular from 'angular';

export default ($stateProvider, $urlRouterProvider) => {
  $urlRouterProvider.otherwise('/');

  const f = fn => ({
    foo: ['$q', '$ocLazyLoad', ($q, $ocLazyLoad) => {
      const deferred = $q.defer();

      fn(name => {
        $ocLazyLoad.load({ name: name.default });
        deferred.resolve();
      });

      return deferred.promise;
    }]
  });

  $stateProvider
    .state('main', {
      url: '/',
      template: '<main></main>',
      resolve: f(fn => require.ensure([], () => fn(require('./containers/main/'))))
    })
    .state('menu', {
      url: '/menu',
      template: '<menu></menu>',
      resolve: f(fn => require.ensure([], () => fn(require('./containers/menu/'))))
    });
};
