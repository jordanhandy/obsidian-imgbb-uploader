/*
* @Author: Jordan Handy
*/
import {
    App,
    PluginSettingTab,
    Setting,
    Notice
} from 'obsidian';

import ImgBBUploader from './main'
const Electron = require("electron");
const{
    remote: { safeStorage }
} = Electron

//Define ImgBB Settings
export interface ImgBBSettings {
    apiKey: string;
    expiration: boolean;
    expirationTime: string;
    clipboard: boolean;
    dragDrop: boolean;
    captureLinks: boolean;
}
export const DEFAULT_SETTINGS: ImgBBSettings = {
    apiKey: "",
    expiration: false,
    expirationTime: "",
    clipboard: true,
    dragDrop: false,
    captureLinks: false
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
        new Setting(containerEl)
            .setName("API key")
            .setDesc("The API key given to you by ImgBB.  This value is stored as an environment variable and is not written to plugin persistent data.  Once you paste your API key in, close the window and re-open settings to validate the value is set to 'hidden'")
            .addText((text) => {
                text
                    .setPlaceholder("apikey123")
                    .setValue(this.plugin.settings.apiKey)
                    .onChange(async (value) => {
                        let tempKey;
                        // Electron safeStorage to encrypt
                        if(safeStorage.isEncryptionAvailable()){
                            tempKey = safeStorage.encryptString(value);
                        }else{
                            tempKey = value;
                        }
                        this.plugin.settings.apiKey = tempKey;
                        await this.plugin.saveSettings();
                        new Notice('API Key for imgBB has been encrypted and saved!',2000);
                    })
            });
        new Setting(containerEl)
            .setName("Set image expiration?")
            .setDesc("If enabled, uploads will be automatically deleted after specified set time (seconds).  Per ImgBB, minimum is 60 seconds.")
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
            .setName("Expiration time (seconds)")
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
            new Setting(containerEl).setName('Behaviour').setHeading();
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
            new Setting(containerEl)
            .setName("Capture image hyperlinks on paste?")
            .setDesc("If enabled, pasting image source URLs into a note will automatically attempt an upload to ImgBB")
            .addToggle((toggle) => {
                toggle
                    .setValue(this.plugin.settings.captureLinks)
                    .onChange(async (value) => {
                        try {
                            this.plugin.settings.captureLinks = value;
                            await this.plugin.saveSettings();
                        }
                        catch (e) {
                            console.log(e)
                        }
                    })
            });

    }
}