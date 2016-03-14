export default {
  bindings: {},
  controller: function($stateParams, notification) {
    const vm = this;

    vm.postId = $stateParams.id;
    vm.notification = notification;
    vm.sendEmail = function() {
      if (vm.email) {
        vm.notification.log('Email successfully sent to ' + this.email, {addnCls: 'humane-flatty-success'});
      } else {
        vm.notification.log('Email is undefined', { addnCls: 'humane-flatty-error' });
      }
    };
  },
  controllerAs: 'controller'
};
