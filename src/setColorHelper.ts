import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";

const DEFAULT_SQUARE = "■";

const COLORS = [
    { label: "🔴 Red", description: "#f28b82" },
    { label: "🟢 Green", description: "#b7e1cd" },
    { label: "🔵 Blue", description: "#aecbfa" },
    { label: "🟣 Purple", description: "#d7aefb" },
    { label: "⚫ Black", description: "#404040" },
    { label: "⚪ White", description: "#ffffff" },
    { label: "🎨 Custom color", description: "Enter hex manually" },
];

const HEX_OR_NAME_REGEXP = /^#([0-9a-fA-F]{6})$|^[a-zA-Z]+$/;

interface ProjectSettings {
    projectName?: string;
    labelBackgroundColor?: string;
    squareColor?: string;
}

const getSettingsPath = (): string | null => {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        return null;
    }
    return path.join(
        workspaceFolders[0].uri.fsPath,
        ".vscode",
        "settings.json"
    );
};

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
    return {};
};

const writeWorkspaceSettings = (
    settingsPath: string,
    settings: Record<string, any>
): void => {
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 4));
};

export const getProjectSettings = (): ProjectSettings => {
    const settingsPath = getSettingsPath();
    if (!settingsPath) {
        return {};
    }

    const settings = readWorkspaceSettings(settingsPath);
    return settings?.statusBarProject || {};
};

const saveProjectSettings = (projectSettings: ProjectSettings): void => {
    const settingsPath = getSettingsPath();
    if (!settingsPath) {
        vscode.window.showErrorMessage("No workspace folder open.");
        return;
    }

    const settings = readWorkspaceSettings(settingsPath) || {};
    settings.statusBarProject = projectSettings;
    writeWorkspaceSettings(settingsPath, settings);
};

export const updateStatusBarItem = (
    statusBarItem: vscode.StatusBarItem,
    settings: ProjectSettings
): void => {
    const projectName = settings.projectName || "";
    const labelBgColor = settings.labelBackgroundColor || "#404040";
    const squareColor = settings.squareColor || "#ffffff";

    if (projectName) {
        statusBarItem.text = projectName;
        statusBarItem.backgroundColor = new vscode.ThemeColor(
            "statusBarItem.errorBackground"
        );
    } else {
        statusBarItem.text = DEFAULT_SQUARE;
        statusBarItem.backgroundColor = new vscode.ThemeColor(
            "statusBarItem.errorBackground"
        );
    }

    statusBarItem.color = projectName ? labelBgColor : squareColor;
};

const pickColorFromPalette = async (
    title: string
): Promise<string | null> => {
    const selected = await vscode.window.showQuickPick(COLORS, {
        placeHolder: title,
    });

    if (!selected) {
        return null;
    }

    if (selected.label.includes("Custom")) {
        const input = await vscode.window.showInputBox({
            prompt: 'Enter a color (hex: #RRGGBB or name like "red")',
            placeHolder: "#ff0000",
            validateInput: (val) =>
                HEX_OR_NAME_REGEXP.test(val)
                    ? null
                    : "Enter a valid hex color or CSS color name",
        });
        return input || null;
    }

    return selected.description || null;
};

export const showConfigurationMenu = async (): Promise<
    ProjectSettings | null
> => {
    const currentSettings = getProjectSettings();

    const option = await vscode.window.showQuickPick(
        [
            {
                label: "📝 Set Project Name",
                description: `Current: ${currentSettings.projectName || "Not set"}`,
                value: "name",
            },
            {
                label: "🎨 Set Label Background Color",
                description: `Current: ${currentSettings.labelBackgroundColor || "Not set"}`,
                value: "labelColor",
            },
            {
                label: "🔲 Set Square Color",
                description: `Current: ${currentSettings.squareColor || "Not set"}`,
                value: "squareColor",
            },
        ],
        { placeHolder: "Choose what to configure" }
    );

    if (!option) {
        return null;
    }

    const updatedSettings = { ...currentSettings };

    if (option.value === "name") {
        const name = await vscode.window.showInputBox({
            prompt: "Enter project name (leave empty to show square)",
            placeHolder: "My Project",
            value: currentSettings.projectName || "",
        });

        if (name === undefined) {
            return null;
        }

        updatedSettings.projectName = name;
    }

    if (option.value === "labelColor") {
        const color = await pickColorFromPalette(
            "Pick background color for project name label"
        );
        if (!color) {
            return null;
        }
        updatedSettings.labelBackgroundColor = color;
    }

    if (option.value === "squareColor") {
        const color = await pickColorFromPalette("Pick color for square");
        if (!color) {
            return null;
        }
        updatedSettings.squareColor = color;
    }

    saveProjectSettings(updatedSettings);
    vscode.window.showInformationMessage("Status bar configuration updated!");

    return updatedSettings;
};
