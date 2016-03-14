import { Component, Inject, FORM_DIRECTIVES } from 'angular2/angular2';

import TodoService from './todo-service';
import TodoModel from './todo-model';

@Component({
	selector: 'todo-input',
	styles: [`
		form {
			display: inline-block;
			padding: 5px;
			border: 1px solid black;
		}
	`],
	template: `
		<form (ng-submit)="onSubmit()">
			<div>
				<label>Title</label>
				<input #title type="text" [(ng-model)]="todoModel.title">
			</div>
			<div>
				<label>Action</label>
				<input type="text" [(ng-model)]="todoModel.action">
			</div>

			<button type="submit" (click)="title.focus()">Submit</button>
		</form>
	`
})
export default class TodoInput {
	todoModel = new TodoModel();
	todoService;

	constructor(@Inject(TodoService) todoService) {
		this.todoService = todoService;
	}

	onClick(event, value) {
		this.todoService.addTodo(value);
	}

	onSubmit() {
		this.todoService.addTodo(this.todoModel);
		this.todoModel = new TodoModel();
	}
}
