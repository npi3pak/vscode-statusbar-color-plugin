import * as vscode from "vscode";
import {
    showConfigurationMenu,
    updateStatusBarItem,
    getProjectSettings
} from "./setColorHelper";

let statusBarItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
    statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left,
        1000
    );

    const settings = getProjectSettings();
    updateStatusBarItem(statusBarItem, settings);
    statusBarItem.show();

    context.subscriptions.push(statusBarItem);

    const configWatcher = vscode.workspace.onDidChangeConfiguration((event) => {
        if (event.affectsConfiguration("statusBarProject")) {
            const updatedSettings = getProjectSettings();
            updateStatusBarItem(statusBarItem, updatedSettings);
        }
    });

    context.subscriptions.push(configWatcher);

    const configureCommand = vscode.commands.registerCommand(
        "extension.configureStatusBar",
        async () => {
            const updatedSettings = await showConfigurationMenu();
            if (updatedSettings) {
                updateStatusBarItem(statusBarItem, updatedSettings);
            }
        }
    );

    context.subscriptions.push(configureCommand);
}

export function deactivate() {
    if (statusBarItem) {
        statusBarItem.dispose();
    }
}
