import type { Core } from "@strapi/strapi";

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
};

export default register;
