# URL Extractor Pro - Chrome Extension

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) <!-- Optional Badge -->

A powerful Chrome extension to extract URLs from the current page's HTML based on user-defined regular expressions. Manage your regex patterns, view extraction results grouped by pattern, and keep a searchable history of all extracted URLs.

<!-- Optional: Add a key screenshot here -->
<!-- ![Extension Screenshot](path/to/your/screenshot.png) -->

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [From Chrome Web Store (Coming Soon)](#from-chrome-web-store-coming-soon)
- [From Source (for Development/Testing)](#from-source-for-developmenttesting)
- [How to Use](#how-to-use)
- [Extract Tab](#extract-tab)
- [Manage Regex Tab](#manage-regex-tab)
- [History Tab](#history-tab)
- [Development](#development)
- [Persistence](#persistence)
- [Limitations](#limitations)
- [Privacy](#privacy)
- [Contributing](#contributing)
- [License](#license)

## Overview

This extension enhances basic URL extraction by allowing you to define and manage multiple regular expression patterns. When you trigger an extraction on the current web page, it scans the page's full HTML source using all your saved regex patterns. The results are conveniently grouped by the pattern that found them, and buttons allow you to open any found URL in a new background tab. Additionally, a history tab keeps track of all uniquely extracted URLs over time, with search and sort capabilities.

## Features

- **Tabbed Interface:** Clean UI with separate tabs for Extraction, Regex Management, and History.
- **Custom Regex Management:** Add, edit, and delete regex patterns with descriptive names.
- **Multi-Regex Extraction:** Scans page HTML using _all_ saved regex patterns simultaneously.
- **Grouped Results:** Displays extracted URLs grouped under the name of the matching regex pattern.
- **Background Tab Opening:** "Open" buttons open links in new background tabs (no focus shift).
- **Persistent Storage:** Regex patterns and history are saved locally and persist across sessions.
- **History Tracking:** Automatically logs all unique URLs found during extractions with timestamps.
- **History Search & Sort:** Filter history by URL content and sort by timestamp.

## Installation

### From Chrome Web Store (Coming Soon)

_(Once published, add the link here)_

- Visit the [URL Extractor Pro listing]() on the Chrome Web Store.
- Click "Add to Chrome".

### From Source (for Development/Testing)

1.  **Clone or Download:** Clone this repository or download the source code as a ZIP file and extract it.
  ```bash
  git clone https://github.com/YOUR_USERNAME/html-url-extractor-enhanced.git
  cd html-url-extractor-enhanced
  ```
2.  **Open Chrome Extensions:** Open Google Chrome, type `chrome://extensions/` in the address bar, and press Enter.
3.  **Enable Developer Mode:** In the top-right corner, toggle "Developer mode" ON.
4.  **Load Unpacked:** Click "Load unpacked".
5.  **Select Folder:** Navigate to and select the `html-url-extractor-enhanced` directory (the one containing `manifest.json`). Click "Select Folder".
6.  **Done:** The extension icon should appear in your toolbar.

## How to Use

Click the extension icon in your toolbar to open the popup. Use the tabs at the top (`Extract`, `Manage Regex`, `History`) to navigate.

### Extract Tab

1.  Navigate to the target web page.
2.  Open the popup (ensure the "Extract" tab is active).
3.  Click "Extract URLs from Current Tab".
4.  Results appear below, grouped by the regex pattern name.
5.  Use the action buttons next to each URL:
  - Click the "↗" icon to open the URL in a background tab.
  - Click the "⎘" icon to copy the URL to your clipboard.
6.  Use the "Open All" button to open all URLs in a group at once.

### Manage Regex Tab

1.  **Add:** Enter a Name and Regex Value (pattern only, no `/` delimiters, use `\\` for backslashes), click "Add Regex".
2.  **Edit:** Click "Edit" on an existing pattern, modify the form, click "Update Regex".
3.  **Delete:** Click "Delete" on an existing pattern and confirm.

### History Tab

1.  View previously extracted URLs, sorted newest first by default.
2.  **Search:** Type in the search box to filter URLs.
3.  **Sort:** Use the dropdown to change sorting (Newest/Oldest).
4.  Click "Open" to open a historical URL in a background tab.

## Development

To work on the extension code:

1.  Follow the "Installation From Source" steps above to load the unpacked extension.
2.  Make changes to the code (`popup.js`, `popup.html`, `popup.css`, `manifest.json`).
3.  Go back to `chrome://extensions/`.
4.  Click the refresh icon (circular arrow) on the "URL Extractor Pro" card.
5.  Reopen the extension popup to see your changes. Use the browser's Developer Tools (F12) on the popup or the target page for debugging (`console.log`, etc.).

## Persistence

Your custom regex patterns and the extraction history are stored locally using `chrome.storage.local`. This data survives browser/computer restarts but is removed if the extension is uninstalled or its data is manually cleared.

## Limitations

- Reads the rendered HTML source at the moment of extraction; may not capture all dynamically loaded content appearing later.
- Cannot run on restricted browser pages (`chrome://...`, web store, etc.) due to security policies.

## Privacy

This extension prioritizes your privacy. All regex patterns and history data are stored **only locally** on your computer using `chrome.storage.local`. No data is ever collected, transmitted, or shared externally.

Please review the full [Privacy Policy](PRIVACY_POLICY.md) included in this repository. _(Note: The official policy for the Chrome Web Store must be hosted publicly online - see `PRIVACY_POLICY.md` for details)_.

## Contributing

Contributions are welcome! Please read the [Contributing Guidelines](CONTRIBUTING.md) for details on reporting bugs, suggesting features, and submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
