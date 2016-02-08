import blessed from 'blessed';

export default () => {
	var screen = blessed.screen({
	  smartCSR: true
	});

	screen.title = 'blessed-lab';
	screen.key(['escape', 'q', 'C-c'], function(ch, key) {
	  return process.exit(0);
	});

	return screen;
};
