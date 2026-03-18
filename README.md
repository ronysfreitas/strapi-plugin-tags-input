# strapi-plugin-tags-input

Strapi 5 plugin that adds a `tags` custom field to edit a list of tags (`array of strings`) and store it in the database as a JSON `string`.

## What this plugin does

- Registers the `tags` custom field on the server (`type: text`).
- Registers the custom field in the admin panel with a tags input component.
- Serializes the value to JSON before saving (e.g. `["news","featured","tech"]`).

## Requirements

- Node.js 18+ (recommended: Node.js 20)
- Strapi 5

## Local plugin development

```bash
npm install
npm run build
npm run verify
```

## How to use in a Strapi 5 project

1. In the plugin project:

```bash
npm install
npm run watch:link
```

2. In the Strapi project (in another terminal):

```bash
npx yalc add --link strapi-plugin-tags-input
npm install
npm run develop
```

3. In the Content-Type Builder:

- Add a new field.
- Open the Custom fields category.
- Select `Tags`.

## Database value format

The value is stored as JSON text. Examples:

- No tags: `[]`
- With tags: `["javascript","strapi","cms"]`

## Main structure

- `server/src/register.ts`: backend custom field registration.
- `admin/src/index.ts`: admin custom field registration.
- `admin/src/components/TagsInput.tsx`: visual input with add/remove tag behavior.
