import { Plugin, TFile, WorkspaceLeaf, Notice } from 'obsidian';
import { LaTeXSettingsTab, LaTeXSettings, DEFAULT_SETTINGS } from './settings';
import { LaTeXView, VIEW_TYPE_LATEX } from './latex-view';
import { TeXLabLSPClient } from './texlab-client';
import { TectonicCompiler } from './tectonic-compiler';

export default class LaTeXPlugin extends Plugin {
    settings: LaTeXSettings;
    lspClient: TeXLabLSPClient;
    compiler: TectonicCompiler;

    async onload() {
        await this.loadSettings();
        
        // Initialize LSP client and compiler
        this.lspClient = new TeXLabLSPClient(this.settings);
        this.compiler = new TectonicCompiler(this.settings, this.app);

        // Register custom view for .tex files
        this.registerView(VIEW_TYPE_LATEX, (leaf) => new LaTeXView(leaf, this));

        // Try to register .tex extension (this might work in some versions)
        this.registerExtensions(['tex'], VIEW_TYPE_LATEX);

        // Register workspace events for file handling
        this.registerEvent(
            this.app.workspace.on('file-open', (file) => {
                if (file && file.extension === 'tex') {
                    console.log('Detected .tex file opening:', file.path);
                    this.ensureTexFileInLatexView(file);
                }
            })
        );

        // Register event for when files are created
        this.registerEvent(
            this.app.vault.on('create', (file) => {
                if (file instanceof TFile && file.extension === 'tex') {
                    console.log('New .tex file created:', file.path);
                }
            })
        );

        // Add ribbon icon for compilation
        this.addRibbonIcon('file-text', 'Compile LaTeX', () => {
            this.compileActiveTeX();
        });

        // Add command for compilation
        this.addCommand({
            id: 'compile-latex',
            name: 'Compile LaTeX to PDF',
            callback: () => this.compileActiveTeX(),
            hotkeys: [{ modifiers: ['Mod', 'Shift'], key: 'l' }]
        });

        // Add command to open tex file in latex view
        this.addCommand({
            id: 'open-tex-file',
            name: 'Open LaTeX file in LaTeX view',
            callback: () => this.openActiveTexFile()
        });

        // Add settings tab
        this.addSettingTab(new LaTeXSettingsTab(this.app, this));

        // Initialize LSP when plugin loads
        await this.lspClient.initialize();

        console.log('LaTeX plugin loaded successfully');
    }

    async onunload() {
        // Clean up LSP client
        if (this.lspClient) {
            await this.lspClient.shutdown();
        }
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
        // Restart LSP with new settings
        await this.lspClient.restart(this.settings);
        // Update compiler with new settings
        this.compiler = new TectonicCompiler(this.settings, this.app);
    }

    private async ensureTexFileInLatexView(file: TFile) {
        // Check if file is already open in LaTeX view
        const existingLeaf = this.app.workspace.getLeavesOfType(VIEW_TYPE_LATEX)
            .find(leaf => (leaf.view as LaTeXView).file === file);
        
        if (existingLeaf) {
            console.log('File already open in LaTeX view');
            this.app.workspace.revealLeaf(existingLeaf);
            return;
        }

        // Check if file is open in a regular leaf, and convert it
        const activeLeaf = this.app.workspace.activeLeaf;
        if (activeLeaf && activeLeaf.view.file === file) {
            console.log('Converting active leaf to LaTeX view');
            await activeLeaf.setViewState({
                type: VIEW_TYPE_LATEX,
                state: { file: file.path }
            });
        }
    }

    private async openActiveTexFile() {
        const activeFile = this.app.workspace.getActiveFile();
        if (!activeFile) {
            new Notice('No file is currently active');
            return;
        }
        
        if (activeFile.extension !== 'tex') {
            new Notice('Active file is not a .tex file');
            return;
        }

        console.log('Manually opening .tex file in LaTeX view:', activeFile.path);
        
        // Get the active leaf and convert it to LaTeX view
        const activeLeaf = this.app.workspace.activeLeaf;
        if (activeLeaf) {
            await activeLeaf.setViewState({
                type: VIEW_TYPE_LATEX,
                state: { file: activeFile.path }
            });
            new Notice('Opened in LaTeX view');
        } else {
            new Notice('No active leaf found');
        }
    }

    private async compileActiveTeX() {
        const activeFile = this.app.workspace.getActiveFile();
        if (!activeFile || !activeFile.path.endsWith('.tex')) {
            new Notice('No active .tex file to compile');
            return;
        }

        try {
            const pdfPath = await this.compiler.compile(activeFile);
            new Notice(`✅ Compiled successfully!\nPDF saved to: ${pdfPath}`, 5000);
            
            // Don't automatically open PDF in Obsidian to avoid path errors
            // User can navigate to the output folder to view the PDF
            console.log(`PDF created at: ${pdfPath}`);
        } catch (error) {
            new Notice(`❌ Compilation failed: ${error.message}`);
            console.error('LaTeX compilation error:', error);
        }
    }
}

