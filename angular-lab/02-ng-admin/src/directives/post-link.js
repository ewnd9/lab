export default {
  restrict: 'E',
  scope: { entry: '&' },
  template: '<p class="form-control-static"><a ng-click="displayPost()">View&nbsp;post</a></p>',
  link: function (scope, $location) {
    scope.displayPost = function () {
      $location.path('/posts/show/' + scope.entry().values.post_id); // jshint ignore:line
    };
  }
};
