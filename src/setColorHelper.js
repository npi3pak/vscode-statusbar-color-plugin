"use strict";
var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value);
                  });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator["throw"](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : adopt(result.value).then(fulfilled, rejected);
            }
            step(
                (generator = generator.apply(thisArg, _arguments || [])).next()
            );
        });
    };
Object.defineProperty(exports, "__esModule", { value: true });
exports.onChangeColorFromCommand = void 0;
const fs = require("fs");
const path = require("path");
const vscode = require("vscode");
const COLORS = [
    {
        label: "↩️ Reset to default",
        description: "Remove custom color setting",
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
const readWorkspaceSettings = (settingsPath) => {
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
const onChangeColorFromCommand = () =>
    __awaiter(void 0, void 0, void 0, function* () {
        const selected = yield vscode.window.showQuickPick(COLORS, {
            placeHolder: "Pick a color for statusBarItem.remoteBackground",
        });
        if (!selected) {
            return;
        }
        let color = selected.description;
        if (selected.label.includes("Custom")) {
            const input = yield vscode.window.showInputBox({
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
        const updatedSettings = Object.assign(Object.assign({}, settings), {
            "workbench.colorCustomizations": Object.assign(
                Object.assign(
                    {},
                    settings["workbench.colorCustomizations"] || {}
                ),
                { "statusBarItem.remoteBackground": color }
            ),
        });
        fs.writeFileSync(
            settingsPath,
            JSON.stringify(updatedSettings, null, 2)
        );
        vscode.window.showInformationMessage(
            `Updated statusBarItem.remoteBackground to ${color}`
        );
    });
exports.onChangeColorFromCommand = onChangeColorFromCommand;
//# sourceMappingURL=setColorHelper.js.map
