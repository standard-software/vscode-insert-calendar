const vscode = require('vscode');

function activate(context) {

	console.log('Congratulations, your extension "vscode-insert-calendar" is now active!');

	let disposable = vscode.commands.registerCommand('vscode-insert-calendar.helloWorld', function () {

    vscode.window.showInformationMessage('Hello World from vscode-insert-calendar!');
	});

	context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
