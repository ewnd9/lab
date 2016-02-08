import { Component, Inject, NgFor, FORM_DIRECTIVES } from 'angular2/angular2';

import TodoService from './todo-service';
import TodoModel from './todo-model';

@Component({
	selector: 'todo-search',
	directives: [NgFor, FORM_DIRECTIVES],
	template: `
		<input type="text" [(ng-model)]="term">
	`
})
export default class TodoSearch {
	term;
}
