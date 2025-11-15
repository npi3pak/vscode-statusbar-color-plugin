# 🏷️ Status Bar Project Label

A lightweight VS Code extension that adds a customizable project name label to the status bar. Perfect for quickly identifying which project you're working on.

## ✨ Features

- 📝 Display custom project name in the status bar
- 🎨 Customize label text color
- 💾 Settings saved per workspace in `.vscode/settings.json`
- 🖱️ Click on the label to configure settings
- 🔲 Shows default square symbol (■) when no project name is set

## 🚀 How to Use

1. Open the command palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
2. Search for and select: **Configure Status Bar Project Label**
3. Choose what to configure:
   - **Set Project Name** - Enter a custom name for your project (leave empty to show default square)
   - **Set Label Color** - Choose text color for the label

Alternatively, click directly on the status bar label to open configuration.

## 📋 Settings

The extension stores settings in your workspace's `.vscode/settings.json`:

```json
{
    "statusBarProject": {
        "projectName": "My Project",
        "labelColor": "#f28b82"
    }
}
```

## 🎨 Available Preset Colors

- Red (#f28b82)
- Green (#b7e1cd)
- Blue (#aecbfa)
- Purple (#d7aefb)
- Black (#404040)
- White (#ffffff)
- Custom color (enter hex manually)

## 💡 Use Cases

- Quickly identify which project you're working on when multiple VS Code windows are open
- Color-code different types of projects
- Add visual distinction to your workspace

## 📦 Installation

1. Download the `.vsix` file
2. Install via VS Code: Extensions > ... > Install from VSIX
3. Or use command line: `code --install-extension statusbar-color-plugin-*.vsix`

## 🔧 Development

```bash
npm install
npm run compile
```

Press `F5` to open Extension Development Host for testing.
