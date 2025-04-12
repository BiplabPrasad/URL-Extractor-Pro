# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Placeholder for next feature.

### Fixed

- Placeholder for next bug fix.

## [1.1.2] - 2025-04-12

### Changed

- Changes the icons to the new ones.
- Renamed the extension to "URL Extractor Pro".

## [1.1.0] - 2025-04-11

### Added

- History tab to view previously extracted unique URLs.
- Search functionality within the History tab.
- Sorting functionality (Newest/Oldest) for the History tab.
- Manage Regex tab for adding, editing, and deleting custom regex patterns.
- Grouping of extracted URLs under the corresponding regex pattern name in the Extract tab.
- Persistence for Regex patterns and History using `chrome.storage.local`.
- Basic regex validation in the Manage Regex form.
- LICENSE file (MIT).
- CONTRIBUTING.md guidelines.
- PRIVACY_POLICY.md file (copy for repo).
- .gitignore file.

### Changed

- Renamed extension to "URL Extractor Pro".
- Updated UI to use a tabbed interface.
- Enhanced error handling and status messages across all tabs.
- Extraction process now uses all saved regex patterns instead of a single hardcoded one.
- Refactored `popup.js` for better organization and to support new features.
- Updated `README.md` to reflect new features and structure.
- Increased minimum popup width in `popup.css`.

### Fixed

- URLs are now escaped using `escapeHtml` before rendering to prevent potential XSS issues.
- Ensured script injection checks for restricted pages (`chrome://`, web store).

## [1.0.0] - 2025-04-10

### Added

- Initial release.
- Basic functionality to extract hardcoded CodeDeploy URLs from page HTML.
- Display results in the popup with "Open" buttons.
- Open URLs in background tabs.
- Basic `manifest.json`, `popup.html`, `popup.js`, `popup.css`.
- Placeholder Icons.
