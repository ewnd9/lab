import angular from 'angular';

const appName = 'myApp';

angular
  .module(appName, [])
  .controller('MyController', function($scope) {
    $scope.greetMe = 'World';
  });

angular.element(document).ready(function() {
  angular.bootstrap(document, [appName]);
});
