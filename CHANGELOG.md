# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.1] - 2025-05-12

### Fixed
- Fixed URL Extractor breaking due to escape characters.

## [1.2.0] - 2025-05-12

### Added
- New icon buttons in URL list items for improved user interaction
- Copy to clipboard functionality for extracted URLs
- Visual feedback when URLs are copied (checkmark icon and temporary highlighting)
- Improved action buttons layout with consistent styling across the extension
- Better visual distinction between URL text and action buttons

### Changed
- Redesigned URL list items to use icon-based buttons instead of text buttons
- Updated styling for action buttons to use a more compact, icon-based design
- Improved spacing and alignment in URL list items
- Enhanced visual feedback for user interactions (button hover states, copy confirmation)
- Standardized button appearance across different tabs for better consistency

### Fixed
- Improved word breaking for long URLs to prevent layout issues
- Better handling of URL text overflow with proper truncation and tooltips
- Consistent styling between extract results and history items

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
