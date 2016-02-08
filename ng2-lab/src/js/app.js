require('./../scss/style.scss');

import 'zone.js/lib/browser/zone-microtask';
import 'reflect-metadata';

import { Component, bootstrap } from 'angular2/angular2';

import TodoInput from './todo-input';
import TodoList from './todo-list';

import TodoService from './todo-service';

@Component({
  selector: 'hello-app',
  directives: [TodoInput, TodoList],
  template: `
    <todo-list></todo-list>
    <todo-input></todo-input>
  `
})
export class HelloApp {
  name = 'World';
};

bootstrap(HelloApp, [TodoService]);
