# strapi-plugin-tags-custom-field

Strapi 5 plugin that adds a `tags` custom field to edit a list of tags (`array of strings`) and store it as a native JSON array.

## What this plugin does

- Registers the `tags` custom field on the server (`type: json`).
- Registers the custom field in the admin panel with a tags input component.
- Saves tags as JSON array values (e.g. `["news","featured","tech"]`).
- Uses Strapi Design System components for native admin look and feel.
- Supports keyboard and clipboard workflows for faster data entry.

## Requirements

- Node.js 18+ (recommended: Node.js 20)
- Strapi 5

## Local plugin development

```bash
npm install
npm run build
npm run test:ts
npm run verify
```

## Install from npm (recommended)

```bash
npm install strapi-plugin-tags-custom-field
```

Then restart your Strapi server and add the field in Content-Type Builder:

- Add a new field.
- Open the Custom fields category.
- Select `Tags`.
- Configure the custom field options if needed (see below).

## Link locally during development

1. In the plugin project:

```bash
npm install
npm run watch:link
```

2. In the Strapi project (in another terminal):

```bash
npx yalc add --link strapi-plugin-tags-custom-field
npm install
npm run develop
```

3. In the Strapi Content-Type Builder, add the `Tags` custom field.

## Input behavior and UX

- Press `Enter` to add the current tag.
- Press the configured separator (default: `,`) to add the current tag.
- Paste multiple tags at once (separated by newline or the configured separator).
- Press `Backspace` on an empty input to remove the last tag.
- Each draft tag has a configurable character limit with a live counter in the UI.

## Custom field options (Content-Type Builder)

- `maxTags` (number, default: `20`): maximum number of tags allowed.
- `maxTagLength` (number, default: `40`): maximum number of characters per tag.
- `allowDuplicates` (boolean, default: `false`): allows repeated tags.
- `separator` (text, default: `,`): character used for splitting input/paste.
- `normalizeCase` (select, default: `none`): `none`, `lowercase`, or `UPPERCASE`.

## Database value format

The value is stored as a native JSON array. Examples:

- No tags: `[]`
- With tags: `["javascript","strapi","cms"]`

## Main structure

- `server/src/register.ts`: backend custom field registration.
- `admin/src/index.ts`: admin custom field registration.
- `admin/src/components/TagsInput.tsx`: visual input with add/remove tag behavior.

## Release checklist

1. Update version in `package.json`.
2. Run:

```bash
npm ci
npm run release:check
```

3. Publish to npm:

```bash
npm publish
```

