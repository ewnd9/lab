import styles from './style.css';

export default {
  bindings: {},
  template: require('!!raw!./main.html'),
  controllerAs: 'vm',
  controller: function() {
    const vm = this;
    vm.styles = styles;
    vm.greetMe = 'World';
  }
};
