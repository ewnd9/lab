import blessed from 'blessed';

import Screen from './../components/screen';
import ChatMessage from './../components/chat-message';

import { messages, author, largeMessage } from './../fixtures/chat-messages';

export default () => {
	var screen = Screen();

	var box = blessed.box({
		top: 0,
		tags: true,
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
		}
	});

	screen.append(box);

	var offset = 0;
	for (var i = 0 ; i < messages.length * 50 ; i++) {
		var curr = ChatMessage(screen, messages[i % messages.length].author, messages[i % messages.length].message, box.width, offset);
		box.append(curr);
		offset += curr.height;
	}

	box.scrollTo(offset);
	box.focus();
	screen.render();
};
