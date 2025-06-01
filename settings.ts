import { App, PluginSettingTab, Setting } from 'obsidian';
import LaTeXPlugin from './main';

export interface LaTeXSettings {
    texlabPath: string;
    tectonicPath: string;
    outputDirectory: string;
    tectonicFlags: string[];
    autoSave: boolean;
    enableLSP: boolean;
}

export const DEFAULT_SETTINGS: LaTeXSettings = {
    texlabPath: 'texlab',
    tectonicPath: 'tectonic',
    outputDirectory: 'output',
    tectonicFlags: ['-X', 'compile'],
    autoSave: true,
    enableLSP: false  // Disabled by default until we fix LSP issues
};

export class LaTeXSettingsTab extends PluginSettingTab {
    plugin: LaTeXPlugin;

    constructor(app: App, plugin: LaTeXPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: 'LaTeX Plugin Settings' });

        new Setting(containerEl)
            .setName('Enable LSP')
            .setDesc('Enable TeXLab LSP integration for advanced features (experimental)')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.enableLSP)
                .onChange(async (value) => {
                    this.plugin.settings.enableLSP = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('TeXLab Path')
            .setDesc('Path to TeXLab executable')
            .addText(text => text
                .setPlaceholder('texlab')
                .setValue(this.plugin.settings.texlabPath)
                .onChange(async (value) => {
                    this.plugin.settings.texlabPath = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Tectonic Path')
            .setDesc('Path to Tectonic executable')
            .addText(text => text
                .setPlaceholder('tectonic')
                .setValue(this.plugin.settings.tectonicPath)
                .onChange(async (value) => {
                    this.plugin.settings.tectonicPath = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Output Directory')
            .setDesc('Directory for compiled PDFs (relative to vault root)')
            .addText(text => text
                .setPlaceholder('output')
                .setValue(this.plugin.settings.outputDirectory)
                .onChange(async (value) => {
                    this.plugin.settings.outputDirectory = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Auto-save')
            .setDesc('Automatically save .tex files before compilation')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.autoSave)
                .onChange(async (value) => {
                    this.plugin.settings.autoSave = value;
                    await this.plugin.saveSettings();
                }));
    }
}

