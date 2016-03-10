export default {
  template: require('html!./main.html'),
  controller: ($scope, $rootScope) => {
    console.log($scope, $rootScope);
  }
};

console.log('hi')
