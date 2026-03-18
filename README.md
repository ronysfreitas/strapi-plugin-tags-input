# strapi-plugin-tags-input

Plugin para Strapi 5 que adiciona um custom field `tags` para editar uma lista de tags (`array de strings`) e salvar no banco como `string` JSON.

## O que este plugin faz

- Registra o custom field `tags` no servidor (`type: text`).
- Registra o custom field no admin com um componente de input de tags.
- Serializa o valor para JSON antes de salvar (ex.: `["news","featured","tech"]`).

## Requisitos

- Node.js 18+ (recomendado: Node.js 20)
- Strapi 5

## Desenvolvimento local do plugin

```bash
npm install
npm run build
npm run verify
```

## Como usar em um projeto Strapi 5

1. No projeto do plugin:

```bash
npm install
npm run watch:link
```

2. No projeto Strapi (em outro terminal):

```bash
npx yalc add --link strapi-plugin-tags-input
npm install
npm run develop
```

3. No Content-Type Builder:

- Adicione um novo campo.
- Abra a categoria de Custom fields.
- Selecione `Tags`.

## Formato salvo no banco

O valor é salvo como texto JSON. Exemplos:

- Sem tags: `[]`
- Com tags: `["javascript","strapi","cms"]`

## Estrutura principal

- `server/src/register.ts`: registro do custom field no backend.
- `admin/src/index.ts`: registro do custom field no admin.
- `admin/src/components/TagsInput.tsx`: input visual com adição/remoção de tags.