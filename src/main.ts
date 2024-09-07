import { Editor, Notice, Plugin } from 'obsidian';
import ImgBBUploaderSettingsTab from './settings-tab'
import { DEFAULT_SETTINGS, ImgBBSettings } from "./settings-tab";
import { supportedExtensions } from './formats';
import axios from "axios";
const Electron = require('electron')

const {
	remote: { safeStorage }
} = Electron

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

		// If you enabled to capture links, we find the plaintext of the link,
		// and also check if it is a valid image format for upload.  Only then do we
		// trigger upload logic
		if (this.settings.captureLinks &&
			event.clipboardData?.getData('text/plain') != '' &&
			this.isType(undefined, event.clipboardData?.getData('text/plain'))) {
			await this.uploadFiles(files, event, editor, event.clipboardData?.getData('text/plain'));
		} else {

			// Otherwise, just check if files exist and don't pass text to
			// method
			if (files.length > 0) {
				await this.uploadFiles(files, event, editor, undefined);
			}
		}
	}

	// For Drag and Drop
	private dropHandler = async (event: DragEventInit, editor: Editor): Promise<void> => {
		const { files } = event.dataTransfer;
		if (this.settings.captureLinks &&
			event.dataTransfer?.getData('text/plain') != '' &&
			this.isType(undefined, event.dataTransfer?.getData('text/plain'))) {
			await this.uploadFiles(files, event, editor, event.dataTransfer?.getData('text/plain'));
		} else {
			if (files.length > 0) {
				await this.uploadFiles(files, event, editor, undefined);
			}
		}
	}

	// Type-checking with imgBB supported formats
	private isType(file: File | undefined, text: String | undefined): boolean {
		// File and text check for file extensions
		let isValid = false;
		for (let ext of supportedExtensions) {
			if (file) {
				if (file.name.endsWith(ext)) {
					isValid = true;
					return isValid;
				}
			} else if (text != '') {
				if (text.endsWith(ext)) {
					isValid = true;
					return isValid;
				}
			}
		}
		return isValid;
	}
	// Upload logic
	private async uploadFiles(files: FileList, event, editor: Editor, clipText: String | undefined) {
		event.preventDefault();
		// Decrypt key for uploading process -- safeStorage
		let decryptedkey; // Decrypted buffer for API key | API key from settings

		if (safeStorage.isEncryptionAvailable()) {
			decryptedkey = await safeStorage.decryptString(Buffer.from(this.settings.apiKey));
		} else {
			decryptedkey = this.settings.apiKey;
		}
		let formParams;
		if (this.settings.apiKey != '') {
			if (this.settings.expiration) {
				formParams = {
					key: decryptedkey,
					expiration: this.settings.expirationTime
				}
			} else {
				formParams = {
					key: decryptedkey,
				}
			}
			if (files.length > 0) {
				// If files exist, check file type compatibility, then upload
				for (let file of files) {
					if (this.isType(file, undefined)) {
						this.apiCall(file, decryptedkey, formParams, editor);
					}
				}
			} else if (clipText != '') {
				// If no files exist, we check text compatibility, then upload
				if (this.isType(undefined, clipText)) {
					this.apiCall(clipText, decryptedkey, formParams, editor);
				}
			}

		} else {
			new Notice('It looks like you haven\'t specified an API key.  This is required for upload', 0);
		}
	}
	private async apiCall(file: File | String | undefined, decryptedkey: Blob, formParams: any, editor: Editor) {
		const randomString = (Math.random() * 10086).toString(36).substr(0, 8)
		const pastePlaceText = `![uploading...](${randomString})\n`
		editor.replaceSelection(pastePlaceText);
		let formData = new FormData();
		formData.append('image', file);
		formData.append('key', decryptedkey);
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
		}).catch((err) => {
			new Notice('There was an error uploading images to imgBB.  Please double-check settings and try again.  You can share the error message with the developer ' + err, 0);
			console.log(err);
		})
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
