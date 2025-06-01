import { FileView, WorkspaceLeaf, TFile } from 'obsidian';
import { EditorView } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { latex } from './latex-language';
import LaTeXPlugin from './main';

export const VIEW_TYPE_LATEX = 'latex-view';

export class LaTeXView extends FileView {
    plugin: LaTeXPlugin;
    editor: EditorView | null = null;

    constructor(leaf: WorkspaceLeaf, plugin: LaTeXPlugin) {
        super(leaf);
        this.plugin = plugin;
    }

    getViewType(): string {
        return VIEW_TYPE_LATEX;
    }

    getDisplayText(): string {
        return this.file?.basename || 'LaTeX';
    }

    async onLoadFile(file: TFile): Promise<void> {
        console.log('LaTeX view loading file:', file.path);
        
        // Clear any existing editor
        if (this.editor) {
            this.editor.destroy();
            this.editor = null;
        }

        try {
            // Simplified setup to avoid extension conflicts
            const extensions = [
                latex(),
                EditorView.theme({
                    '.cm-content': {
                        fontFamily: 'monospace',
                        fontSize: '14px',
                        lineHeight: '1.5'
                    },
                    '.cm-editor': {
                        height: '100%'
                    },
                    '.cm-focused': {
                        outline: 'none'
                    },
                    // Use standard CodeMirror token classes for better compatibility
                    '.cm-keyword': {
                        color: '#0066cc',
                        fontWeight: 'bold'
                    },
                    '.cm-def': {
                        color: '#cc6600',
                        fontWeight: 'bold'
                    },
                    '.cm-comment': {
                        color: '#666666',
                        fontStyle: 'italic'
                    },
                    '.cm-bracket': {
                        color: '#990099',
                        fontWeight: 'bold'
                    },
                    '.cm-operator': {
                        color: '#cc0000',
                        fontWeight: 'bold'
                    },
                    '.cm-number': {
                        color: '#009900'
                    },
                    '.cm-string-2': {
                        color: '#9900cc',
                        fontWeight: 'bold'
                    },
                    '.cm-atom': {
                        color: '#cc6600'
                    }
                })
            ];

            const content = await this.app.vault.read(file);
            console.log('File content loaded, length:', content.length);

            // Initialize editor
            this.editor = new EditorView({
                state: EditorState.create({
                    doc: content,
                    extensions
                }),
                parent: this.contentEl
            });

            console.log('LaTeX editor initialized successfully');
        } catch (error) {
            console.error('Error loading LaTeX file:', error);
        }
    }

    async onUnloadFile(): Promise<void> {
        console.log('LaTeX view unloading file');
        if (this.editor) {
            this.editor.destroy();
            this.editor = null;
        }
    }

    getViewData(): string {
        return this.editor?.state.doc.toString() || '';
    }

    setViewData(data: string, clear: boolean): void {
        if (this.editor) {
            const transaction = this.editor.state.update({
                changes: {
                    from: 0,
                    to: this.editor.state.doc.length,
                    insert: data
                }
            });
            this.editor.dispatch(transaction);
        }
    }

    clear(): void {
        this.setViewData('', true);
    }

    async save(): Promise<void> {
        if (this.file && this.editor) {
            const content = this.editor.state.doc.toString();
            await this.app.vault.modify(this.file, content);
            console.log('LaTeX file saved');
        }
    }

    // Handle view state changes
    getState(): any {
        const state = super.getState();
        return state;
    }

    setState(state: any, result: any): Promise<void> {
        console.log('LaTeX view setState called with:', state);
        return super.setState(state, result);
    }
}

