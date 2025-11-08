# Bookmark Extension

A simple browser extension to save and manage your bookmarks locally.

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/suhas991/Bookmark-extension.git
cd Bookmark-extension
```

### 2. Add to your browser

#### Chrome / Edge

1. Go to `chrome://extensions/`
2. Turn on **Developer Mode**
3. Click **Load unpacked**
4. Select the folder with `manifest.json`

#### Firefox

1. Go to `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on**
3. Select the `manifest.json` file

## Usage

* Click the extension icon to open it.
* Add new bookmarks using the popup.
* View or delete saved bookmarks from the view page.

## Folder Structure

```
Bookmark-extension/
├── manifest.json
├── popup.html / popup.js / popup.css
├── view.html / view.js / view.css
├── edit.html / edit.js / edit.css
└── icon.png
```

## Features

* Save bookmarks locally
* View, edit, or delete bookmarks
* Simple and fast

## License

MIT License © 2025 Suhas NH
