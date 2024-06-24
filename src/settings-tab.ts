/*
 * @Author: Jordan Handy
 */
import {
    App,
    PluginSettingTab,
    Setting,
} from 'obsidian';
const electron = require('electron');

import ImgBBUploader from './main'

//Define ImgBB Settings
export interface ImgBBSettings {
        apiKey: string;
        expiration:boolean;
        expirationTime:string;
        clipboard:boolean;
        dragDrop:boolean;
    }
export const DEFAULT_SETTINGS: ImgBBSettings = {
    apiKey: "",
    expiration: false,
    expirationTime:"",
    clipboard: true,
    dragDrop: false
};
export default class ImgBBUploaderSettingsTab extends PluginSettingTab {
  
    plugin: ImgBBUploader;
    constructor(app: App, plugin: ImgBBUploader) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display(): void {
        const { containerEl } = this;

        containerEl.empty();
        containerEl.createEl("h3", { text: "ImgBB Settings" });

        new Setting(containerEl)
            .setName("API Key")
            .setDesc("The API Key given to you by ImgBB.  This is attempted to be stored securely, but is store as plaintext otherwise")
            .addText((text) => {
                text
                    .setPlaceholder("apikey123")
                    .setValue(this.plugin.settings.apiKey)
                    .onChange(async (value) => {
                        this.plugin.settings.apiKey = value;
                        await this.plugin.saveSettings();
                    })
            });
            new Setting(containerEl)
            .setName("Set Image Expiration?")
            .setDesc("If enabled, uploads will be automatically deleted after specified set time (seconds)")
            .addToggle((toggle) => {
                toggle
                    .setValue(this.plugin.settings.expiration)
                    .onChange(async (value) => {
                        try {
                            this.plugin.settings.expiration = value;
                            await this.plugin.saveSettings();
                        }
                        catch (e) {
                            console.log(e)
                        }
                    })
            });
        new Setting(containerEl)
            .setName("Expiration Time (seconds)")
            .setDesc("Expiration time for uploads (in seconds)")
            .addText((text) => {
                text
                    .setPlaceholder("")
                    .setValue(this.plugin.settings.expirationTime)
                    .onChange(async (value) => {
                        try {
                            this.plugin.settings.expirationTime = value;
                            await this.plugin.saveSettings();
                        }
                        catch (e) {
                            console.log(e)
                        }
                    })
            });
            containerEl.createEl("h4", { text: "Behaviour" });
            new Setting(containerEl)
            .setName("Paste via clipboard copy/paste?")
            .setDesc("Enable clipboard copy / paste?")
            .addToggle((toggle) => {
                toggle
                    .setValue(this.plugin.settings.clipboard)
                    .onChange(async (value) => {
                        try {
                            this.plugin.settings.clipboard = value;
                            await this.plugin.saveSettings();
                        }
                        catch (e) {
                            console.log(e)
                        }
                    })
            });
            new Setting(containerEl)
            .setName("Enable drag / drop uploads?")
            .setDesc("Enable drag and drop uploads?")
            .addToggle((toggle) => {
                toggle
                    .setValue(this.plugin.settings.dragDrop)
                    .onChange(async (value) => {
                        try {
                            this.plugin.settings.dragDrop = value;
                            await this.plugin.saveSettings();
                        }
                        catch (e) {
                            console.log(e)
                        }
                    })
            });

    }
}