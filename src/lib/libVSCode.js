const vscode = require(`vscode`);

// VSCode System

const registerCommand = (context, commandName, func) => {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      commandName, func
    )
  );
};

const getEditor = () => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showInformationMessage(`No editor is active`);
    return;
  }
  return editor;
};

const commandQuickPick = (commands, placeHolder) => {
  // const commands = commandsArray.map(c => ({label:c[0], description:c[1], func:c[2]}));
  // command = [
  //   {label:``, description:``, func: ()=>{}},
  //   {label:``, kind:vscode.QuickPickItemKind.Separator}
  // ]
  vscode.window.showQuickPick(
    // eslint-disable-next-line no-unused-vars
    commands.map(({func, ...command}) => (command)),
    {
      canPickMany: false,
      placeHolder
    }
  ).then((item) => {
    if (!item) { return; }
    commands.find(({label}) => label === item.label).func();
  });
};

// VSCode editor.selections
const insertTextUnSelect = (editor, str) => {
  editor.edit(editBuilder => {
    for (const selection of editor.selections) {
      editBuilder.replace(selection, ``);
      editBuilder.insert(selection.active, str);
    }
  });
};

const insertText = (editor, str) => {
  editor.edit(editBuilder => {
    for (const selection of editor.selections) {
      editBuilder.replace(selection, str);
    }
  }).then(() => {
    const newSelections = [];
    for (const selection of editor.selections) {
      if (
        selection.start.line === selection.end.line
        && selection.start.character === selection.end.character
      ) {
        const strLines = str.split(`\n`);
        const selectionStartLine = selection.start.line - (strLines.length - 1);
        const selectionStartCharactor =
          editor.document.lineAt(selectionStartLine).text.length -
          strLines[0].length
        newSelections.push(new vscode.Selection(
          selectionStartLine,
          selectionStartCharactor,
          selection.start.line,
          selection.start.character
        ));
      } else {
        newSelections.push(selection);
      }
    }
    editor.selections = newSelections;
  });
};

const getSelectedText = (editor) => {
  const result = [];
  for (let selection of editor.selections) {
    const text = editor.document.getText(selection);
    result.push(text);
  };
  return result;
}


module.exports = {
  registerCommand,
  getEditor,
  commandQuickPick,

  insertTextUnSelect,
  insertText,
  getSelectedText,
};
