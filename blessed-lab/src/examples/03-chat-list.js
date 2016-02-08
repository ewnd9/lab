import blessed from 'blessed';

import Screen from './../components/screen';
import { messages, author, largeMessage } from './../fixtures/chat-messages';

export default () => {
	var screen = Screen();

	var items = [];
	for (var i = 0 ; i < 100 ; i++) {
		items.push(messages[0].author + ' x' + i + ' ' + largeMessage);
	}

	var box = blessed.list({
	  tags: true,
	  padding: {
	    left: 1,
	    right: 1
	  },
	  input: true,
	  scrollable: true,
	  keys: true,
	  vi: true,
	  mouse: true,
	  alwaysScroll: true,
	  scrollbar: {
	    ch: ' ',
	    inverse: true,
	    fg: 'red'
	  },
	  style: {
	    selected: {
	      fg: 'grey',
	      bg: 'white'
	    }
	  }
	});

	screen.append(box);

	for (var i = 0 ; i < items.length ; i++) {
		box.pushItem(items[i]);
	}

	box.focus();
	// box.scrollTo(70);
	screen.render();
};
