export default {
  template: require('html!./main.html'),
  controller: ($scope, $rootScope) => {
    console.log('main', $scope, $rootScope);
  }
};
