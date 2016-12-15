// https://github.com/RodrigoEspinosa/gitter-cli

var Marked = require('./marked');
var HtmlToText = require('html-to-text');

var wordwrap = require('wordwrap');

var Lexer = new Marked.Lexer({
	gfm: true,
	tables: false,
	pedantic: true,
	sanitize: true,
	smartypants: true
});

export let parseText = (messageText, wordwrap) => {
  var tokens = Lexer.lex(messageText);
  messageText = Marked.parser(tokens);
  messageText = HtmlToText.fromString(messageText, {
    wordwrap: wordwrap || 80
  });

  return messageText;
};
