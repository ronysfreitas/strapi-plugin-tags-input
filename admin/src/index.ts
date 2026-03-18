import { PLUGIN_ID } from "./pluginId";
import { PluginIcon } from "./components/PluginIcon";
import { getTranslation } from "./utils/getTranslation";

export default {
  register(app: any) {
    app.customFields.register({
      name: "tags",
      pluginId: PLUGIN_ID,
      type: "json",
      intlLabel: {
        id: getTranslation("field.tags.label"),
        defaultMessage: "Tags",
      },
      intlDescription: {
        id: getTranslation("field.tags.description"),
        defaultMessage: "Edit tags as an array of strings",
      },
      icon: PluginIcon,
      components: {
        Input: async () =>
          import("./components/TagsInput").then((module) => ({
            default: module.TagsInput,
          })),
      },
      options: {
        base: [
          {
            sectionTitle: {
              id: getTranslation("field.tags.options.behavior.section"),
              defaultMessage: "Tag behavior",
            },
            items: [
              {
                intlLabel: {
                  id: getTranslation("field.tags.options.maxTags.label"),
                  defaultMessage: "Maximum tags",
                },
                description: {
                  id: getTranslation("field.tags.options.maxTags.description"),
                  defaultMessage: "Maximum number of tags allowed (default 50)",
                },
                name: "options.maxTags",
                type: "number",
                value: 20,
              },
              {
                intlLabel: {
                  id: getTranslation("field.tags.options.maxTagLength.label"),
                  defaultMessage: "Maximum tag length",
                },
                description: {
                  id: getTranslation(
                    "field.tags.options.maxTagLength.description"
                  ),
                  defaultMessage: "Maximum number of characters per tag (default 100)",
                },
                name: "options.maxTagLength",
                type: "number",
                value: 40,
              },
              {
                intlLabel: {
                  id: getTranslation("field.tags.options.allowDuplicates.label"),
                  defaultMessage: "Allow duplicates",
                },
                description: {
                  id: getTranslation(
                    "field.tags.options.allowDuplicates.description"
                  ),
                  defaultMessage: "Allow repeated tags in the same value",
                },
                name: "options.allowDuplicates",
                type: "checkbox",
                value: false,
              },
            ],
          },
          {
            sectionTitle: {
              id: getTranslation("field.tags.options.input.section"),
              defaultMessage: "Input parsing",
            },
            items: [
              {
                intlLabel: {
                  id: getTranslation("field.tags.options.separator.label"),
                  defaultMessage: "Separator",
                },
                description: {
                  id: getTranslation("field.tags.options.separator.description"),
                  defaultMessage:
                    "Character used to split typed and pasted values",
                },
                name: "options.separator",
                type: "text",
                value: "",
              },
              {
                intlLabel: {
                  id: getTranslation("field.tags.options.normalizeCase.label"),
                  defaultMessage: "Normalize case",
                },
                description: {
                  id: getTranslation(
                    "field.tags.options.normalizeCase.description"
                  ),
                  defaultMessage: "Transform tag casing before saving",
                },
                name: "options.normalizeCase",
                type: "select",
                value: "none",
                options: [
                  {
                    key: "none",
                    value: "none",
                    metadatas: {
                      intlLabel: {
                        id: getTranslation(
                          "field.tags.options.normalizeCase.none"
                        ),
                        defaultMessage: "None",
                      },
                    },
                  },
                  {
                    key: "lowercase",
                    value: "lowercase",
                    metadatas: {
                      intlLabel: {
                        id: getTranslation(
                          "field.tags.options.normalizeCase.lowercase"
                        ),
                        defaultMessage: "lowercase",
                      },
                    },
                  },
                  {
                    key: "uppercase",
                    value: "uppercase",
                    metadatas: {
                      intlLabel: {
                        id: getTranslation(
                          "field.tags.options.normalizeCase.uppercase"
                        ),
                        defaultMessage: "UPPERCASE",
                      },
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    });

    app.registerPlugin({
      id: PLUGIN_ID,
      name: "Tags Input",
    });
  },

  async registerTrads({ locales }: { locales: string[] }) {
    return Promise.all(
      locales.map(async (locale) => {
        try {
          const { default: data } = await import(
            `./translations/${locale}.json`
          );

          return { data, locale };
        } catch {
          return { data: {}, locale };
        }
      })
    );
  },
};
