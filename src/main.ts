import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import ImgBBUploaderSettingsTab from './settings-tab'
import { DEFAULT_SETTINGS, ImgBBSettings } from "./settings-tab";
import { supportedExtensions } from './formats';
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

	private async uploadFiles(files : FileList,event,editor){
		let formParams;
		if(files.length > 0 && isType){
			for(let file of files){
				if(this.settings.expiration){
					formParams = {
						key: this.settings.apiKey,
						expiration: this.settings.expirationTime
					}
				}else{
					formParams = {
						key: this.settings.apiKey,
					}
				}
				let formData = new FormData();
				formData.append('image',file);
				// Make API call
				axios({
					url:'https://api.imgbb.com/upload',
					method: 'POST',
					data: formData,
					params: formParams
				})
				
			}

		}
	}


	async onload() {
		await this.loadSettings();
		this.addSettingTab(new ImgBBUploaderSettingsTab(this.app, this));
	}

	onunload() {
		console.log('unloading imgBB Uploader...');
	}

	async loadSettings() {
		console.log('Loading imgBB Uploader...');
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

  // When saving settings
  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
    this.clearHandlers();
    this.setupHandlers();
  }
}
