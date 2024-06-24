import { Editor, Notice, Plugin} from 'obsidian';
import ImgBBUploaderSettingsTab from './settings-tab'
import { DEFAULT_SETTINGS, ImgBBSettings } from "./settings-tab";
import { supportedExtensions } from './formats';
import axios from "axios";

export default class ImgBBUploader extends Plugin {
	settings: ImgBBSettings;

	// Remove handlers for paste
	private clearHandlers(): void {
		this.app.workspace.off('editor-paste', this.pasteHandler);
		this.app.workspace.off('editor-drop', this.dropHandler);
	}

	// Setup handlers depending on what was specified
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
	// For clipboard copy paste
	private pasteHandler = async (event: ClipboardEvent, editor: Editor): Promise<void> => {
		const { files } = event.clipboardData;
		await this.uploadFiles(files, event, editor);
	}

	// For Drag and Drop
	private dropHandler = async (event: DragEventInit, editor: Editor): Promise<void> => {
		const { files } = event.dataTransfer;
		await this.uploadFiles(files, event, editor);
	}

	// Type-checking with imgBB supported formats
	private isType(file: File): boolean {
		let isValid = false;
		for (let ext of supportedExtensions) {
			if (file.name.endsWith(ext)) {
				isValid = true;
				return isValid;
			}
		}
		return isValid;
	}
	// Upload logic
	private async uploadFiles(files: FileList, event, editor) {
		let formParams;
		if (files.length > 0 && this.settings.apiKey != '') {
			for (let file of files) {
				if (this.isType(file)) {
					event.preventDefault();
					const randomString = (Math.random() * 10086).toString(36).substr(0, 8)
					const pastePlaceText = `![uploading...](${randomString})\n`
					editor.replaceSelection(pastePlaceText)
					if (this.settings.expiration) {
						formParams = {
							key: process.env.apiKey,
							expiration: this.settings.expirationTime
						}
					} else {
						formParams = {
							key: process.env.apiKey,
						}
					}
					let formData = new FormData();
					formData.append('image', file);
					// Make API call
					axios({
						url: `https://api.imgbb.com/1/upload`,
						method: 'POST',
						data: formData,
						headers: {
							"Content-Type": "multipart/form-data",
						},
						params: formParams
					}).then((res) => {
						let replaceMarkdownText = `![](${res.data.data.display_url})`;
						// Show MD syntax using uploaded image URL, in Obsidian Editor
						this.replaceText(editor, pastePlaceText, replaceMarkdownText);
					}).catch((err)=>{
						new Notice('There was an error uploading images to imgBB.  Please double-check settings and try again.  You can share the error message with the developer '+err,0);
					})

				}
			}

		}else{
			new Notice('It looks like you haven\'t specified an API key.  This is required for upload',0);
		}
	}



	// Function to replace text
	private replaceText(editor: Editor, target: string, replacement: string): void {
		target = target.trim();
		let lines = [];
		for (let i = 0; i < editor.lineCount(); i++) {
			lines.push(editor.getLine(i));
		}
		for (let i = 0; i < lines.length; i++) {
			const ch = lines[i].indexOf(target)
			if (ch !== -1) {
				const from = { line: i, ch };
				const to = { line: i, ch: ch + target.length };
				editor.replaceRange(replacement, from, to);
				break;
			}
		}
	}
	// Load settings and setup handlers
	async onload() {
		await this.loadSettings();
		this.addSettingTab(new ImgBBUploaderSettingsTab(this.app, this));
		this.setupHandlers();
	}

	// Unload plugin
	onunload() {
		console.log('unloading imgBB Uploader...');
		this.clearHandlers();
	}

	async loadSettings() {
		console.log('Loading imgBB Uploader...');
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	// When saving settings, clear handlers and start afresh
	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
		this.clearHandlers();
		this.setupHandlers();
	}
}
