// https://github.com/RodrigoEspinosa/gitter-cli

import wordwrap from 'wordwrap';
import { format} from 'util';
import { parseText} from './parse-text';

export default (author, message, width) => {
	var text = getText(author, message, width);
	return {
		text: text,
		height: text.split('\n').length || 1
	};
};

const MAX_AUTHOR_LENGTH = 18;
const DISPLAY_AUTHOR = true;
const AUTHOR_COLOR = 'red';

let getText = (author, text, width) => {
	if (author.length > MAX_AUTHOR_LENGTH) {
		author = author.substring(0, MAX_AUTHOR_LENGTH - 1);
	} else if (author.length < MAX_AUTHOR_LENGTH) {
		author = author + Array(MAX_AUTHOR_LENGTH - author.length).join(' ');
	}

	var authorLength = MAX_AUTHOR_LENGTH;
	var messageMaxWidth = width - authorLength - 4;

	text = parseText(text, messageMaxWidth);

	if (text.length > messageMaxWidth) {
		text = wordwrap(messageMaxWidth)(text);
		text = text.split('\n').map(function (line, index) {
			if (index < 1) {
				return line;
			}

			return Array(authorLength + 1).join(' ') + line;
		}).join('\n');
	}

	var authorWithColor;

	if (DISPLAY_AUTHOR) {
		authorWithColor = format('{%s-fg}%s{/%s-fg}',
			AUTHOR_COLOR,
			author,
			AUTHOR_COLOR
		);
	} else {
		authorWithColor = Array(authorLength).join(' ');
	}

	return format('%s %s', authorWithColor, text);
};
