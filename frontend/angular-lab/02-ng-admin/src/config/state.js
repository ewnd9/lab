export default $stateProvider => {
  $stateProvider.state('stats', {
    parent: 'main',
    url: '/stats',
    template: require('!!raw!./ng-admin/templates/stats.html')
  });

  $stateProvider.state('send-post', {
    parent: 'main',
    url: '/sendPost/:id',
    params: { id: null },
    template: '<send-post></send-post>'
  });
};
