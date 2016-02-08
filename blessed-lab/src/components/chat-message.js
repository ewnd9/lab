import blessed from 'blessed';
import chatMessageFormat from './../utils/chat-message-format';

export default (screen, author, message, width, offset) => {
	var { text, height } = chatMessageFormat(author, message, width);

	var box = blessed.box({
		top: offset,
		width: '100%',
		tags: true,
		content: text
	});

	box.height = height;
	return box;
};
