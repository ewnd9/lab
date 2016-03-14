import { Pipe } from 'angular2/angular2';

@Pipe({
	name: 'simpleSearch',
	pure: false // update not only after params change
})
export default class SimpleSearch {
	transform(value, [field, prefix]) {
		return value.filter((todo) => !prefix || todo[field].includes(prefix));
	}
}
