# ImgBB Uploader for Obsidian

## License

Released under [MIT](/LICENSE) by [@jordanhandy](https://github.com/jordanhandy).

## What is it?
[ImgBB](https://imgbb.com/) is a cloud storage platform that allows you to upload image files to their storage platform.  Offering both paid and free plans, ImgBB is extremely lightweight and might be the perfect solution for some people looking to save on local storage in their Obsidian vaults.

This plugin allows you to automatically upload images pasted or dragged into Obsidian directly into your ImgBB account (instead of stored locally).  ImgBB stores only images.  Other media types will not apply

## Setup and Security
ImgBB requires you have an API key.  You can get one by logging in to your ImgBB account, selecting the "About" menu on the top-left-hand-side, and choosing "API".

![ImgBB API Key](https://i.ibb.co/gVzPg5p/image.png)

The API key is referenced as an environment variable and is not saved to the data.json local file created by Obsidian.  For this reason, this reason, this plugin is available on Desktop only.

## How it Works
![2024-06-24_19-51-38 (1)](https://github.com/jordanhandy/obsidian-imgbb-uploader/assets/6423379/0f1ce5a4-afd4-4810-8e61-1cb8dc64838c)



## Settings
Configure settings such as:
- Auto delete after period of time (minimum 60 seconds)
- Upload on copy/paste
- Upload on drag/drop


## Other Plugins
If you would like to use a plugin with more customization options that supports audio, video, and binary formats, check out my [Cloudinary Uploader for Obsidian](https://github.com/jordanhandy/obsidian-cloudinary-uploader)
