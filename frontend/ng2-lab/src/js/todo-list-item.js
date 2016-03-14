import { Component, Inject, Input, NgClass } from 'angular2/angular2';
import TodoService from './todo-service';
import TodoModel from './todo-model';

@Component({
	selector: 'todo-list-item',
	inputs: ['todo'],
	directives: [NgClass],
	styles: [`
		.started {
			color: green;
		}
		.completed {
			text-decoration: line-through;
		}
	`],
	template: `
		<div>
			<span [ng-class]="todo.status" (click)="todo.toggle()">
				{{ todo.title }} > {{ todo.action }}
			</span>
		</div>
	`
})
export default class TodoListItem {}
