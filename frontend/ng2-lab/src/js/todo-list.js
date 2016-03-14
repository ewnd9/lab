import { Component, Inject, NgFor } from 'angular2/angular2';

import TodoService from './todo-service';
import TodoListItem from './todo-list-item';
import TodoSearch from './todo-search';

import LetterSelect from './letter-select';

import StartsWith from './pipes/starts-with';
import SimpleSeach from './pipes/simple-search';

@Component({
	selector: 'todo-list',
	directives: [NgFor, TodoListItem, LetterSelect, TodoSearch],
	pipes: [StartsWith, SimpleSeach],
	template: `
		<div>
			<todo-search #todo-search></todo-search>
			<todo-list-item
				*ng-for="#todo of (todoService.todos | startsWith:'title':letterSelect.selectedLetter) | simpleSearch:'title':todoSearch.term"
				[todo]="todo">
			</todo-list-item>
			<letter-select #letter-select></letter-select>
		</div>
	`
})
export default class TodoList {
	todoService;

	constructor(@Inject(TodoService) todoService) {
		this.todoService = todoService;
	}
}
