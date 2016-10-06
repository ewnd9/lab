'use babel';

import { $, $$, SelectListView } from 'atom-space-pen-views';
import { CompositeDisposable } from 'atom';

import fs from 'fs';
import path from 'path';
import pkgUp from 'pkg-up';

export default class ModulesList extends SelectListView {
  initialize() {
    super.initialize(...arguments);
    this.addClass('overlay from-top');

    if (this.panel == null) {
      this.panel = atom.workspace.addModalPanel({ item: this });
    }
  }

  getFilterKey() {
    return 'name';
  }

  viewForItem(item) {
    return `<li>${item.name}</li>`;
  }

  confirmed(item) {
    atom.workspace.open(require.resolve(item.name));
  }

  cancelled() {
    if (this.panel) {
      this.panel.destroy();
    }
  }

  show() {
    const pkg = pkgUp.sync(atom.workspace.getActiveTextEditor().getPath());
    const modulesDir = path.join(path.dirname(pkg), 'node_modules');
    const modules = fs
      .readdirSync(modulesDir)
      .map(name => ({ name, path: `${modulesDir}/${name}` }));

    this.setItems(modules);
    this.panel.show();

    return this.focusFilterEditor();
  }
}
