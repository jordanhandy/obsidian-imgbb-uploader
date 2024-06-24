import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import ImgBBUploaderSettingsTab from './settings-tab'
import { DEFAULT_SETTINGS, ImgBBSettings } from "./settings-tab";
import axios from "axios";

const electron = require('electron');
export default class ImgBBUploader extends Plugin {
	settings: ImgBBSettings;

	private setupHandlers(): void {
		if (this.settings.clipboard) {
			this.registerEvent(this.app.workspace.on('editor-paste', this.pasteHandler));
		} else {
			this.app.workspace.off('editor-paste', this.pasteHandler);
		}
		if (this.settings.dragDrop) {
			this.registerEvent(this.app.workspace.on('editor-drop', this.dropHandler));
		} else {
			this.app.workspace.off('editor-drop', this.dropHandler);
		}
	}
	private pasteHandler = async (event: ClipboardEvent, editor: Editor): Promise<void> => {
		const { files } = event.clipboardData;
		await this.uploadFiles(files, event, editor); // to fix
	}
	private dropHandler = async (event: DragEventInit, editor: Editor): Promise<void> => {
		const { files } = event.dataTransfer;
		await this.uploadFiles(files, event, editor); // to fix
	}
	async onload() {
		await this.loadSettings();
		this.addSettingTab(new ImgBBUploaderSettingsTab(this.app, this));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
