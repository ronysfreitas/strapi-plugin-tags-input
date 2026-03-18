# strapi-plugin-tags-custom-field

NPM package: https://www.npmjs.com/package/strapi-plugin-tags-custom-field

Custom field plugin for Strapi 5 to manage tags as a native JSON array (`string[]`).

## Installation

```bash
npm install strapi-plugin-tags-custom-field
```

Restart your Strapi server after installation.

## Usage in Strapi

1. Open Content-Type Builder.
2. Add a new field.
3. Open **Custom fields**.
4. Select **Tags**.
5. Configure field options if needed.

## Field options

- `maxTags` (default: `50`): maximum number of tags.
- `maxTagLength` (default: `100`): maximum characters per tag.
- `allowDuplicates` (default: `false`): allow repeated tags.
- `separator` (optional): character used to split typed/pasted values.
- `normalizeCase` (default: `none`): `none`, `lowercase`, or `UPPERCASE`.

## Input behavior

- `Enter` adds the current tag.
- If configured, the separator also adds the current tag.
- Paste supports multiple tags (newline or configured separator).

## Data format

The value is stored as native JSON array and returned as array by Strapi APIs.

Example:

```json
{
  "tags": ["javascript", "strapi", "cms"]
}
```

## Compatibility

- Strapi: `v5`
- Node.js: `>=18 <25` (18 to 24)

## Local development (plugin repo)

```bash
npm install
npm run release:check
```
