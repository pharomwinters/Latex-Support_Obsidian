import { spawn, ChildProcess } from 'child_process';
import { LaTeXSettings } from './settings';

export class TeXLabLSPClient {
    private process: ChildProcess | null = null;
    private settings: LaTeXSettings;

    constructor(settings: LaTeXSettings) {
        this.settings = settings;
    }

    async initialize(): Promise<void> {
        if (!this.settings.enableLSP) {
            console.log('TexLab LSP disabled in settings');
            return;
        }

        try {
            console.log('Starting TexLab LSP server...');
            console.log('TexLab path:', this.settings.texlabPath);
            
            // TexLab newer versions don't use --stdio, they default to stdio
            this.process = spawn(this.settings.texlabPath, [], {
                stdio: ['pipe', 'pipe', 'pipe']
            });

            this.process.on('error', (error) => {
                console.error('TexLab LSP error:', error);
                if (error.message.includes('ENOENT')) {
                    console.error('TexLab executable not found. Make sure it is installed and in PATH.');
                    console.error('You can download TexLab from: https://github.com/latex-lsp/texlab/releases');
                }
            });

            this.process.on('spawn', () => {
                console.log('TexLab LSP server started successfully');
            });

            this.process.on('exit', (code, signal) => {
                console.log(`TexLab LSP server exited with code ${code}, signal ${signal}`);
                if (code !== 0) {
                    console.error('TexLab failed to start. Check if it supports LSP mode.');
                }
            });

            // Listen for messages from TexLab
            this.process.stdout?.on('data', (data) => {
                console.log('TexLab stdout:', data.toString());
            });

            this.process.stderr?.on('data', (data) => {
                console.log('TexLab stderr:', data.toString());
            });

            // Send LSP initialize request
            await this.sendInitializeRequest();
        } catch (error) {
            console.error('Failed to start TexLab:', error);
        }
    }

    private async sendInitializeRequest(): Promise<void> {
        if (!this.process?.stdin) {
            console.error('TexLab process stdin not available');
            return;
        }

        const initRequest = {
            jsonrpc: '2.0',
            id: 1,
            method: 'initialize',
            params: {
                processId: process.pid,
                rootUri: `file://${process.cwd()}`,
                capabilities: {
                    textDocument: {
                        synchronization: { dynamicRegistration: false },
                        completion: { dynamicRegistration: false },
                        hover: { dynamicRegistration: false }
                    }
                }
            }
        };

        console.log('Sending TexLab initialize request:', initRequest);
        this.sendMessage(initRequest);
    }

    private sendMessage(message: any): void {
        if (!this.process?.stdin) {
            console.error('Cannot send message: TexLab stdin not available');
            return;
        }

        const content = JSON.stringify(message);
        const header = `Content-Length: ${Buffer.byteLength(content)}\r\n\r\n`;
        console.log('Sending to TexLab:', header + content);
        this.process.stdin.write(header + content);
    }

    async restart(settings: LaTeXSettings): Promise<void> {
        console.log('Restarting TexLab LSP...');
        this.settings = settings;
        await this.shutdown();
        await this.initialize();
    }

    async shutdown(): Promise<void> {
        if (this.process) {
            console.log('Shutting down TexLab LSP server');
            this.process.kill();
            this.process = null;
        }
    }
}

