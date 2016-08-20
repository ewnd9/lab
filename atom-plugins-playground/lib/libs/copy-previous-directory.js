'use babel';
/* @flow */
/* global atom */

export default () => {
  atom.commands.add('atom-workspace', {
    'markdown-preview:toggle': () => {
      const modalPanels = atom.workspace.getModalPanels();
      if (modalPanels.length === 0) {
        return;
      }

      const panelView = modalPanels[0].getItem();

      let editor;

      try {
        editor = panelView.childNodes[1].getModel();
      } catch (e) {
        return null;
      }

      const text = editor.getText();

      let position = editor.cursors[0].getBufferColumn();
      let begin;
      let end;

      for (; position > 0 ; position--) {
        if (text[position] === '/') {
          if (!end) {
            end = position;
          } else if (!begin) {
            begin = position;
          } else {
            break;
          }
        }
      }

      if (!end) {
        return;
      }

      const prevDirectory = text.substring((begin && begin + 1) || 0, end);
      atom.clipboard.write(prevDirectory);
    }
  });
};
