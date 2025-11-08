# 🌟 Bookmark Extension

A clean and minimal **browser extension** that lets you save, view, and manage your favorite bookmarks easily — all stored locally in your browser.

---

## 🚀 Quick Setup

### 1. Clone this repository

```bash
git clone https://github.com/suhas991/Bookmark-extension.git
cd Bookmark-extension
```

### 2. Add to your browser

#### 🧭 For Chrome / Edge:

1. Open `chrome://extensions/`
2. Enable **Developer Mode** (top-right)
3. Click **Load unpacked**
4. Select the project folder (where `manifest.json` is located)
5. The extension will appear in your toolbar 🎉

#### 🦊 For Firefox:

1. Open `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on**
3. Select the `manifest.json` file
4. The extension will load instantly ✅

---

## 🧩 How It Works

* Click the **Bookmark Extension** icon in your toolbar.
* Use the popup to **add** a new bookmark.
* Open the view page to **see, edit, or delete** saved bookmarks.

---

## 🧱 Folder Structure

```
Bookmark-extension/
├── manifest.json
├── popup.html / popup.js / popup.css
├── view.html / view.js / view.css
├── edit.html / edit.js / edit.css
└── icon.png
```

🗂️ **manifest.json** – Defines permissions and behavior
💾 **popup.*** – Add bookmarks via popup
📚 **view.*** – Manage or browse saved bookmarks
✏️ **edit.*** – Modify existing bookmarks

---

## ⚙️ Manifest Notes

* `manifest_version`: 3 (for Chrome)
* `permissions`: `storage`
* `action`: defines popup and icon behavior

Example snippet:

```json
{
  "manifest_version": 3,
  "name": "Bookmark Extension",
  "version": "1.0",
  "action": {
    "default_popup": "popup.html",
    "default_icon": "icon.png"
  },
  "permissions": ["storage"]
}
```

---

## 🌈 Features

✅ Save bookmarks locally
✅ View, edit, and delete bookmarks
✅ Lightweight and fast
✅ Works offline

---

## 🧭 Coming Soon

* 🔄 Sync across devices
* 🏷️ Tag or categorize bookmarks
* 🔍 Search functionality
* 💾 Import / Export bookmarks

---

## 📜 License

MIT License © 2025 **Suhas NH**
Feel free to modify and use this project for your personal or commercial needs.

---

> 💡 *Tip:* Pin the extension icon in your browser for quick access!
