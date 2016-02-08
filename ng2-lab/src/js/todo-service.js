import TodoModel from './todo-model';

export default class TodoService {
	todos = [
		new TodoModel('eat', 'f'),
		new TodoModel('sleep', 'f'),
		new TodoModel('code', 'f')
	];

	addTodo(todo) {
		this.todos.push(todo);
	}
}
