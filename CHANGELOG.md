# Changelog

All notable changes to this project will be documented in this file.

## [1.0.4] - 2026-03-18

### Changed
- Declared Node.js compatibility range as `>=18 <25` (Node 18 to 24).
- Updated CI to run build and verification on Node.js 18, 20, 22, and 24.
- Updated README compatibility section to document Node.js 18 to 24 support.

## [1.0.3] - 2026-03-18

### Changed
- Made separator behavior opt-in: separator key handling only applies when `options.separator` is configured.
- Updated field hint and placeholder copy for scenarios with and without configured separator.
- Updated custom-field separator option defaults/translations to reflect optional behavior.

### Fixed
- Rendered field description directly below the field label.

## [1.0.2] - 2026-03-18

### Fixed
- Cleared the input after successfully adding tags with Enter, separator, and paste.
- Removed Backspace behavior that removed the last tag when input was empty.
- Rendered field `label` and `description` configured in Strapi Content-Type Builder.

## [1.0.1] - 2026-03-18

### Changed
- Updated README with npm package link, installation steps, and usage guidance.

## [1.0.0] - 2026-03-18

### Added
- Strapi 5 custom field plugin for tags input (`plugin::tags-input.tags`).
- Configurable options in Content-Type Builder:
  - `maxTags`
  - `maxTagLength`
  - `allowDuplicates`
  - `separator`
  - `normalizeCase`
- Keyboard and paste UX improvements for tag entry.
- Minimal GitHub Actions CI pipeline.

### Changed
- Migrated storage to native JSON array (`type: json`) instead of text serialization.
- Removed unused scaffold boilerplate from admin and server code.
