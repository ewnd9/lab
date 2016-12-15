'use strict';


const loginForm = {
  name: 'Login',
  elem: '.login-form'
};

const username = `${loginForm.elem} #login-email-field`;
const password = `${loginForm.elem} #login-password-field_`;

const error = '.error-message';

const runner = require('./setup').runner;

runner(browser => {
  return browser
    .init()
    .url('https://codepen.io/login')
    .webdrivercss('Login Default', loginForm)
    .setValue(username, 'admin')
    .webdrivercss('Login Username', loginForm)
    .setValue(password, 'badpassword')
    .submitForm(loginForm.elem)
    .webdrivercss('Login Error Message', loginForm)
    .isVisible(error)
    .then(function(isErrorVisible) {
      console.log('Is error message visible?', isErrorVisible);
      // Should print "Is error message visible? True"
    })
    .end();
});
