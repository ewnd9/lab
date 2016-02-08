const STARTED = 'started';
const COMPLETED = 'completed';

export default class TodoModel {
	status = STARTED;
	
	title;
	action;

	constructor(title, action) {
		this.title = title;
		this.action = action;
	}

	toggle() {
		this.status = this.status === STARTED ? COMPLETED : STARTED;
	}
}
