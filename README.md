# ImgBB Uploader for Obsidian

## License

Released under [MIT](/LICENSE) by [@jordanhandy](https://github.com/jordanhandy).

## What is it?
[ImgBB](https://imgbb.com/) is a cloud storage platform that allows you to upload image files to their storage platform.  Offering both paid and free plans, ImgBB is extremely lightweight and might be the perfect solution for some people looking to save on local storage in their Obsidian vaults.

This plugin allows you to automatically upload images pasted or dragged into Obsidian directly into your ImgBB account (instead of stored locally).  ImgBB stores only images.  Other media types will not apply

## Setup and Security
ImgBB requires you have an API key.  You can get one by logging in to your ImgBB account, selecting the "About" menu on the top-left-hand-side, and choosing "API".

<img width="256" alt="image" src="https://github.com/user-attachments/assets/5e570fa3-ea55-48d4-bf64-4f4cc1f89223">


When the API key is input into settings, the value is saved.  You will see a notice confirming the value has been encrypted.  If you leave the settings page and return, it may look as though the API key is blank again.  Assuming the plugin original data file hasn't been altered or deleted, your original API key is still encrypted and saved.

If you are unsure, you can simply paste a picture into a note to test a successful upload.  If an upload fails, you can set your API key in settings again.

## How it Works
![demo gif](https://github.com/jordanhandy/obsidian-imgbb-uploader/assets/6423379/621de0c0-9664-4d2c-9753-773316c1d56f)


## Settings
Configure settings such as:
- Auto delete after period of time (minimum 60 seconds)
- Upload on copy/paste
- Upload on drag/drop


## Other Plugins
If you would like to use a plugin with more customization options that supports audio, video, and binary formats, check out my [Cloudinary Uploader for Obsidian](https://github.com/jordanhandy/obsidian-cloudinary-uploader)
