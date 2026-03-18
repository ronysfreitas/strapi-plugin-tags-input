import type { Core } from "@strapi/strapi";

const TAGS_CUSTOM_FIELD_UID = "plugin::tags-input.tags";

type Attribute = {
  type?: string;
  customField?: string;
  component?: string;
  repeatable?: boolean;
  components?: string[];
  target?: string;
};

type Schema = {
  attributes?: Record<string, Attribute>;
};

type TransformMode = "input" | "output";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const parseTags = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter((item) => item.length > 0);
  }

  if (typeof value === "string") {
    const normalized = value.trim();

    if (!normalized) {
      return [];
    }

    try {
      const parsed = JSON.parse(normalized);

      if (Array.isArray(parsed)) {
        return parsed
          .map((item) => String(item).trim())
          .filter((item) => item.length > 0);
      }
    } catch {
      return [normalized];
    }

    return [normalized];
  }

  if (value === null || value === undefined) {
    return [];
  }

  const normalized = String(value).trim();
  return normalized ? [normalized] : [];
};

const serializeTags = (value: unknown): string | null | undefined => {
  if (value === null) {
    return null;
  }

  if (value === undefined) {
    return undefined;
  }

  return JSON.stringify(parseTags(value));
};

const getComponentSchema = (strapi: Core.Strapi, uid?: string): Schema | undefined => {
  if (!uid) {
    return undefined;
  }

  const components = (strapi as Core.Strapi & { components?: Record<string, Schema> })
    .components;

  return components?.[uid];
};

const getContentTypeSchema = (
  strapi: Core.Strapi,
  uid?: string
): Schema | undefined => {
  if (!uid) {
    return undefined;
  }

  const contentTypes = (
    strapi as Core.Strapi & { contentTypes?: Record<string, Schema> }
  ).contentTypes;

  return contentTypes?.[uid];
};

const transformEntity = (
  value: unknown,
  schema: Schema | undefined,
  strapi: Core.Strapi,
  mode: TransformMode
): unknown => {
  if (!isRecord(value) || !schema?.attributes) {
    return value;
  }

  let didChange = false;
  const nextValue: Record<string, unknown> = { ...value };

  for (const [attributeName, attribute] of Object.entries(schema.attributes)) {
    if (!(attributeName in value)) {
      continue;
    }

    const currentValue = value[attributeName];
    const transformedValue = transformAttributeValue(currentValue, attribute, strapi, mode);

    if (transformedValue !== currentValue) {
      nextValue[attributeName] = transformedValue;
      didChange = true;
    }
  }

  return didChange ? nextValue : value;
};

const transformDynamicZone = (
  value: unknown,
  strapi: Core.Strapi,
  mode: TransformMode
): unknown => {
  if (!Array.isArray(value)) {
    return value;
  }

  let didChange = false;

  const nextValue = value.map((entry) => {
    if (!isRecord(entry)) {
      return entry;
    }

    const componentUid = typeof entry.__component === "string" ? entry.__component : undefined;
    const componentSchema = getComponentSchema(strapi, componentUid);
    const transformedEntry = transformEntity(entry, componentSchema, strapi, mode);

    if (transformedEntry !== entry) {
      didChange = true;
    }

    return transformedEntry;
  });

  return didChange ? nextValue : value;
};

const transformRelation = (
  value: unknown,
  attribute: Attribute,
  strapi: Core.Strapi,
  mode: TransformMode
): unknown => {
  if (mode !== "output") {
    return value;
  }

  const targetSchema = getContentTypeSchema(strapi, attribute.target);

  if (!targetSchema) {
    return value;
  }

  if (Array.isArray(value)) {
    let didChange = false;
    const nextValue = value.map((entry) => {
      const transformedEntry = transformEntity(entry, targetSchema, strapi, mode);

      if (transformedEntry !== entry) {
        didChange = true;
      }

      return transformedEntry;
    });

    return didChange ? nextValue : value;
  }

  const transformedValue = transformEntity(value, targetSchema, strapi, mode);
  return transformedValue;
};

const transformComponent = (
  value: unknown,
  attribute: Attribute,
  strapi: Core.Strapi,
  mode: TransformMode
): unknown => {
  const componentSchema = getComponentSchema(strapi, attribute.component);

  if (!componentSchema) {
    return value;
  }

  if (attribute.repeatable) {
    if (!Array.isArray(value)) {
      return value;
    }

    let didChange = false;

    const nextValue = value.map((entry) => {
      const transformedEntry = transformEntity(entry, componentSchema, strapi, mode);

      if (transformedEntry !== entry) {
        didChange = true;
      }

      return transformedEntry;
    });

    return didChange ? nextValue : value;
  }

  return transformEntity(value, componentSchema, strapi, mode);
};

const transformAttributeValue = (
  value: unknown,
  attribute: Attribute,
  strapi: Core.Strapi,
  mode: TransformMode
): unknown => {
  if (attribute.customField === TAGS_CUSTOM_FIELD_UID) {
    return mode === "output" ? parseTags(value) : serializeTags(value);
  }

  if (attribute.type === "component") {
    return transformComponent(value, attribute, strapi, mode);
  }

  if (attribute.type === "dynamiczone") {
    return transformDynamicZone(value, strapi, mode);
  }

  if (attribute.type === "relation") {
    return transformRelation(value, attribute, strapi, mode);
  }

  return value;
};

const transformInputData = <T>(
  data: T,
  schema: Schema | undefined,
  strapi: Core.Strapi
) => transformEntity(data, schema, strapi, "input") as T;

const transformOutputData = <T>(
  data: T,
  schema: Schema | undefined,
  strapi: Core.Strapi
) => {
  if (Array.isArray(data)) {
    let didChange = false;

    const nextData = data.map((entry) => {
      const transformedEntry = transformEntity(entry, schema, strapi, "output");

      if (transformedEntry !== entry) {
        didChange = true;
      }

      return transformedEntry;
    });

    return (didChange ? nextData : data) as T;
  }

  return transformEntity(data, schema, strapi, "output") as T;
};

export { transformInputData, transformOutputData };
