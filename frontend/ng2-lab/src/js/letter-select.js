import { Component, Inject, NgFor, FORM_DIRECTIVES } from 'angular2/angular2';

import TodoService from './todo-service';
import TodoModel from './todo-model';

@Component({
	selector: 'letter-select',
	directives: [NgFor, FORM_DIRECTIVES],
	template: `
		<select [(ng-model)]="selectedLetter">
			<option *ng-for="#letter of letters">{{ letter }}</option>
		</select>
	`
})
export default class LetterSelect {
	letters = ['e', 'c'];
	selectedLetter = 'e';
}
