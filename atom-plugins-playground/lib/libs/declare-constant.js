'use babel';
/* @flow */
/* global atom */

export default () => {
  atom.commands.add('atom-workspace', {
    'declare-constant:toggle': () => {
      const pane = atom.workspace.getActivePane();
      const editor = pane.getActiveEditor();

       editor
        .getCursors()
        .forEach(cursor => {
          const cursorPosition = cursor.getBufferPosition();
          const text = editor.getText();

          const lineRange = [{ ...cursorPosition, column: 0 }, { ...cursorPosition, column: 10000 }];
          const line = editor.getTextInRange(lineRange);

          let position = cursorPosition.column - 1;
          let begin;
          let end;

          while (position < line.length - 1 && line[position].match(/\w/g)) {
            position++;
          }

          while (position > 0 && line[position].match(/\s/g)) {
            position--;
          }

          end = position + 1;

          while (position > 0 && line[position].match(/\w/g)) {
            position--;
          }

          begin = position + 1;

          if (undefined === begin || begin === end) {
            return;
          }

          const code = ` = '${line.slice(begin, end)}';`;

          const nextText =
            line.slice(0, end) +
            code +
            line.slice(end);
          const nextBufferPosition = end + code.length;

          editor.setTextInBufferRange(lineRange, nextText);
          cursor.setBufferPosition({ ...cursorPosition, column: nextBufferPosition });
        });
    }
  });
};
