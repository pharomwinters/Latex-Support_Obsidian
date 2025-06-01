✅ Core Plugin Capabilities
.tex File Support

Extend Obsidian’s file handling to treat .tex as editable, not binary.
    - extend the Markdown editor to support .tex.
    - Syntax Highlighting
    - Use a CodeMirror 6 language extension 
    - allow themes to style LaTeX syntax differently.

TeXLab LSP Integration
    - Add LSP Server capabilities to Obsidian
    - Launch TeXLab as an LSP server in the background.
    - Set up language client/server communication using Obsidian’s Electron node backend.
    - Provide features like linting, autocomplete, hover, go-to-definition, etc.

Tectonic Compilation
    - Use Tectonic’s CLI or Rust API to compile .tex files into PDF.
    - Add a compile command and optionally bind it to a hotkey.
    - Show PDF in Obsidian built in pdf handler

Settings Panel
    - Configurable options like:
        - TeXLab path
        - Tectonic flags
        - Output directory - must be a root of their Obsidian Vault, or current folder
        - Autosave behavior