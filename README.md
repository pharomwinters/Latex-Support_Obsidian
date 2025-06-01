# Obsidian LaTeX Plugin

A comprehensive LaTeX support plugin for Obsidian with TeXLab LSP integration and Tectonic compilation.

## Features

- **LaTeX Syntax Highlighting**: Full syntax highlighting for `.tex` files using CodeMirror
- **Tectonic Compilation**: Compile LaTeX documents to PDF using the Tectonic engine
- **TeXLab LSP Integration**: Advanced language server features (completion, hover, diagnostics)
- **Custom View**: Dedicated editor view for LaTeX files
- **Configurable Settings**: Customize paths, compilation flags, and behavior

## Prerequisites

Before using this plugin, you need to install:

1. **Tectonic**: A modern LaTeX engine
   - Download from: https://tectonic-typesetting.github.io/
   - Or install via package manager (e.g., `cargo install tectonic`)

2. **TeXLab** (optional, for LSP features):
   - Download from: https://github.com/latex-lsp/texlab
   - Or install via package manager

## Installation

### Manual Installation

1. Download the latest release files:
   - `main.js`
   - `manifest.json`
   - `styles.css` (if available)

2. Create a folder named `obsidian-latex-plugin` in your vault's `.obsidian/plugins/` directory

3. Copy the downloaded files into this folder

4. Enable the plugin in Obsidian's Community Plugins settings

### Development Installation

1. Clone this repository into your vault's `.obsidian/plugins/` directory
2. Run `npm install` to install dependencies
3. Run `npm run build` to build the plugin
4. Enable the plugin in Obsidian

## Configuration

Access plugin settings through Settings → Community Plugins → LaTeX Support:

- **Enable LSP**: Toggle TeXLab language server integration
- **TeXLab Path**: Path to the TeXLab executable (default: `texlab`)
- **Tectonic Path**: Path to the Tectonic executable (default: `tectonic`)
- **Output Directory**: Directory for compiled PDFs (default: `output`)
- **Auto-save**: Automatically save .tex files before compilation

## Usage

### Basic Usage

1. Create or open a `.tex` file in your vault
2. The file will automatically open in the LaTeX view with syntax highlighting
3. Use the ribbon icon or hotkey (`Ctrl/Cmd + Shift + L`) to compile to PDF

### Commands

- **Compile LaTeX to PDF**: Compiles the active `.tex` file using Tectonic
  - Hotkey: `Ctrl/Cmd + Shift + L`
  - Available via command palette

### File Structure

The plugin expects your LaTeX files to be standard `.tex` files. Compiled PDFs will be saved to the configured output directory.

## Troubleshooting

### Common Issues

1. **"Tectonic not found"**: Ensure Tectonic is installed and in your PATH, or specify the full path in settings
2. **"TeXLab not found"**: Install TeXLab or disable LSP integration in settings
3. **Compilation errors**: Check the console for detailed error messages

### Debug Mode

Enable developer tools in Obsidian (`Ctrl/Cmd + Shift + I`) to see detailed error messages in the console.

## Development

### Building

```bash
npm install
npm run build
```

### Development Mode

```bash
npm run dev
```

This will watch for changes and rebuild automatically.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Acknowledgments

- [Tectonic](https://tectonic-typesetting.github.io/) - Modern LaTeX engine
- [TeXLab](https://github.com/latex-lsp/texlab) - LaTeX Language Server
- [CodeMirror](https://codemirror.net/) - Text editor component
- [Obsidian](https://obsidian.md/) - Knowledge management platform 