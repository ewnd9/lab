export default {
  bindings: {},
  template: require('!!raw!./profile.html'),
  controllerAs: 'vm',
  controller: function() {
    const vm = this;
    // vm.styles = styles;
    vm.greetMe = 'World';
  }
};
