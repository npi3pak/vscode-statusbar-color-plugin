import * as vscode from "vscode";
import { onChangeColorFromCommand } from "./setColorHelper";

export function activate(context: vscode.ExtensionContext) {
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    const disposable = vscode.commands.registerCommand(
        "extension.pickStatusBarColor",
        async () => {
            // The code you place here will be executed every time your command is executed
            // Display a message box to the
            await onChangeColorFromCommand();
        }
    );
}

// This method is called when your extension is deactivated
export function deactivate() {}
