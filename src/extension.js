const vscode = require('vscode');

const {
  registerCommand,
  getEditor,
  // commandQuickPick,

  insertText,
  // getSelectedText,
} = require(`./lib/libVSCode.js`);

function activate(context) {

  registerCommand(context,
    `vscode-insert-calendar.helloWorld`,
    () => {
      const editor = getEditor(); if (!editor) { return; }
      insertText(editor, `Hello World from vscode-insert-calendar!`)
    }
  );
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
