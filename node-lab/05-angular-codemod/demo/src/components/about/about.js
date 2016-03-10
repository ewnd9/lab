export default {
  template: require('html!./about.html'),
  controller: ($scope, $rootScope) => {
    console.log('about', $scope, $rootScope);
  }
};
