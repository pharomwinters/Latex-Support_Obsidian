import { spawn } from 'child_process';
import { TFile, Notice, App } from 'obsidian';
import { LaTeXSettings } from './settings';
import * as path from 'path';
import * as fs from 'fs';

export class TectonicCompiler {
    private settings: LaTeXSettings;
    private app: App;

    constructor(settings: LaTeXSettings, app: App) {
        this.settings = settings;
        this.app = app;
    }

    async compile(file: TFile): Promise<string> {
        return new Promise((resolve, reject) => {
            // Get vault path - handle different adapter types
            let vaultPath: string;
            const adapter = this.app.vault.adapter;
            
            if ('basePath' in adapter) {
                vaultPath = (adapter as any).basePath;
            } else if ('path' in adapter) {
                vaultPath = (adapter as any).path;
            } else {
                // Fallback: use current working directory
                vaultPath = '';
            }

            console.log('Vault path:', vaultPath);
            console.log('File path:', file.path);
            
            const outputDir = path.join(vaultPath, this.settings.outputDirectory);
            
            // Create output directory if it doesn't exist
            try {
                if (!fs.existsSync(outputDir)) {
                    console.log('Creating output directory:', outputDir);
                    fs.mkdirSync(outputDir, { recursive: true });
                }
            } catch (error) {
                console.error('Failed to create output directory:', error);
                reject(new Error(`Failed to create output directory: ${error.message}`));
                return;
            }
            
            const outputFile = path.join(outputDir, file.basename + '.pdf');
            const inputFile = path.join(vaultPath, file.path);
            
            const args = [
                ...this.settings.tectonicFlags,
                '--outdir', outputDir,
                inputFile
            ];

            console.log('Tectonic command:', this.settings.tectonicPath, args);

            const childProcess = spawn(this.settings.tectonicPath, args, {
                cwd: vaultPath || undefined
            });

            let stdout = '';
            let stderr = '';

            childProcess.stdout?.on('data', (data) => {
                stdout += data.toString();
            });

            childProcess.stderr?.on('data', (data) => {
                stderr += data.toString();
            });

            childProcess.on('close', (code) => {
                console.log('Tectonic output:', stdout);
                console.log('Tectonic errors:', stderr);
                
                if (code === 0) {
                    resolve(outputFile);
                } else {
                    // Provide more helpful error messages
                    let errorMessage = `Tectonic compilation failed (code ${code})`;
                    
                    if (stderr.includes('Unable to load picture') || stderr.includes('file not found')) {
                        errorMessage += '\n\nMissing images or files. Check that all referenced files exist in your vault.';
                    }
                    
                    if (stderr.includes('Fontconfig error')) {
                        errorMessage += '\n\nNote: Fontconfig warnings are usually harmless.';
                    }
                    
                    errorMessage += `\n\nFull error: ${stderr}`;
                    
                    reject(new Error(errorMessage));
                }
            });

            childProcess.on('error', (error) => {
                console.error('Spawn error:', error);
                reject(error);
            });
        });
    }
}

