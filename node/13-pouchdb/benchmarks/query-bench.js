import Benchmark from 'benchmark';
import init, { queryByDynamic, queryByView } from './../utils/init';
import prettyBytes from 'pretty-bytes';
import getSize from 'get-folder-size';

const category = 5;

let pouch1;
let folder1;

let pouch2;
let folder2;

const printStats = (name, pouch, folder) => {
	pouch.info().then((resp) => {
		getSize(folder, (err, size) => {
			console.log(`\n${name} stats:`, resp);
			console.log(`\n${name} size:`, prettyBytes(size), '\n');
		});
	});
};

init(500, false).then(({ pouch, folder }) => {
	pouch1 = pouch;
	folder1 = folder;

	return init(500);
}).then(({ pouch, folder }) => {
	pouch2 = pouch;
	folder2 = folder;

	var suite = new Benchmark.Suite;
	suite.count = 10;

	suite
		.add('dynamic', {
			defer: true,
			fn: function(defered){
				queryByDynamic(pouch1, category).then((res) => {
					defered.resolve();
				});
			}
		})
		.add('stored', {
			defer: true,
			fn: function(defered){
				queryByView(pouch2, category).then((res) => {
					defered.resolve();
				});
			}
		})
		.on('cycle', function(event) {
		  console.log(String(event.target));
		})
		.on('complete', function() {
		  console.log('Fastest is ' + this.filter('fastest').pluck('name'));

			printStats('dynamic', pouch1, folder1);
			printStats('stored', pouch2, folder2);
		})
		.run({ 'async': true });
});
