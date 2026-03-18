import type { Core } from "@strapi/strapi";
import { transformInputData, transformOutputData } from "./utils/tags-transform";

const register = ({ strapi }: { strapi: Core.Strapi }) => {
  strapi.customFields.register({
    name: "tags",
    plugin: "tags-input",
    type: "text",
    inputSize: {
      default: 12,
      isResizable: true,
    },
  });

  strapi.documents.use(async (context, next) => {
    if (
      ["create", "update"].includes(context.action) &&
      context.params &&
      typeof context.params === "object" &&
      "data" in context.params
    ) {
      const paramsWithData = context.params as typeof context.params & {
        data?: unknown;
      };

      paramsWithData.data = transformInputData(
        paramsWithData.data,
        context.contentType,
        strapi
      );
    }

    const result = await next();

    return transformOutputData(result, context.contentType, strapi);
  });
};

export default register;
