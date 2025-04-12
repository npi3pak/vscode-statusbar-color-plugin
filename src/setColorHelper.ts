import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";

const COLORS = [
    {
        label: "↩️ Reset to default",
        description: "default",
    },
    { label: "🔴 Red", description: "#f28b82" },
    { label: "🟢 Green", description: "#b7e1cd" },
    { label: "🔵 Blue", description: "#aecbfa" },
    { label: "🟣 Purple", description: "#d7aefb" },
    { label: "⚫ Black", description: "#404040" },
    { label: "⚪ White", description: "#ffffff" },
    { label: "🎨 Custom color", description: "Enter hex manually" },
];

const HEX_OR_NAME_REGEXP = /^#([0-9a-fA-F]{6})$|^[a-zA-Z]+$/;

const readWorkspaceSettings = (
    settingsPath: string
): Record<string, any> | undefined => {
    const vscodeDir = path.dirname(settingsPath);

    if (!fs.existsSync(vscodeDir)) {
        fs.mkdirSync(vscodeDir);
    }

    if (fs.existsSync(settingsPath)) {
        const raw = fs.readFileSync(settingsPath, "utf8");
        try {
            return JSON.parse(raw) || {};
        } catch (e) {
            vscode.window.showErrorMessage("Error parsing settings.json");
            return {};
        }
    }
};

export const onChangeColorFromCommand = async () => {
    const selected = await vscode.window.showQuickPick(COLORS, {
        placeHolder: "Pick a color for statusBarItem.remoteBackground",
    });

    if (!selected) {
        return;
    }

    let color = selected.description || null;

    if (selected.label.includes("Custom")) {
        const input = await vscode.window.showInputBox({
            prompt: 'Enter a color (hex: #RRGGBB or name like "red")',
            placeHolder: "#ff0000",
            validateInput: (val) =>
                HEX_OR_NAME_REGEXP.test(val)
                    ? null
                    : "Enter a valid hex color or CSS color name",
        });
        if (!input) {
            return;
        }
        color = input;
    }

    if (!color) {
        return;
    }

    if (selected.label.includes("default")) {
        color = null;
    }

    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage("No workspace folder open.");
        return;
    }

    const settingsPath = path.join(
        workspaceFolders[0].uri.fsPath,
        ".vscode",
        "settings.json"
    );

    const settings = readWorkspaceSettings(settingsPath) || {};

    const updatedSettings = {
        ...settings,
        "workbench.colorCustomizations": {
            ...(settings["workbench.colorCustomizations"] || {}),
            "statusBarItem.remoteBackground": color,
        },
    };

    fs.writeFileSync(settingsPath, JSON.stringify(updatedSettings, null, 2));
    vscode.window.showInformationMessage(
        `Updated statusBarItem.remoteBackground to ${color ?? 'default'}`
    );
};
