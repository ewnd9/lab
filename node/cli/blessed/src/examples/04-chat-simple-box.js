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

	for (var i = 0 ; i < messages.length * 50 ; i++) {
		box.pushLine(largeMessage);
	}

	// box.scrollTo(offset);
	box.focus();
	screen.render();
};
