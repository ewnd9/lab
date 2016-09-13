'use babel';
/* @flow */
/* global atom */

export default () => {
  atom.commands.add('atom-workspace', {
    'insert-previous-directory:toggle': () => {
      const modalPanels = atom.workspace.getModalPanels();
      if (modalPanels.length === 0) {
        return;
      }

      const modalPanel = modalPanels.find(panel => {
        return panel.item.classList && panel.item.classList[0] === 'tree-view-dialog';
      });

      const panelView = modalPanel.getItem();

      let editor;

      try {
        editor = panelView.childNodes[1].getModel();
      } catch (e) {
        console.log('no model for ', panelView, modalPanels.length);
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

      let startErase;
      let endErase;

      if (editor.selections && editor.selections[0]) {
        const range = editor.selections[0].getBufferRange();
        startErase = range.start.column;
        endErase = range.end.column;
      } else {
        startErase = editor.cursors[0].getBufferColumn();
        endErase = startErase;
      }

      const nextText =
        text.slice(0, startErase) +
        prevDirectory +
        text.slice(endErase);
      const nextBufferPosition = startErase + prevDirectory.length;

      // atom.clipboard.write(prevDirectory);
      editor.setText(nextText);
      editor.cursors[0].setBufferPosition([0, nextBufferPosition]);
    }
  });
};
