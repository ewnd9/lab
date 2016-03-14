export default {
  restrict: 'E',
  scope: { post: '&' },
  template: '<a class="btn btn-default" ng-click="send()">Send post by email</a>',
  link: function (scope, $location) {
    scope.send = function () {
      $location.path('/sendPost/' + scope.post().values.id);
    };
  }
};
