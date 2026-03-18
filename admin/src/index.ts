import { PLUGIN_ID } from "./pluginId";
import { PluginIcon } from "./components/PluginIcon";
import { getTranslation } from "./utils/getTranslation";

export default {
  register(app: any) {
    app.customFields.register({
      name: "tags",
      pluginId: PLUGIN_ID,
      type: "text",
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
