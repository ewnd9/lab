import { Pipe } from 'angular2/angular2';

@Pipe({
	name: 'startsWith',
	pure: false // update not only after params change
})
export default class StartsWith {
	transform(value, [field, prefix]) {
		return value.filter((todo) => todo[field].startsWith(prefix));
	}
}
