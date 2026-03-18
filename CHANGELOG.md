# Changelog

All notable changes to this project will be documented in this file.

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
