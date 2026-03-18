import * as React from "react";
import {
  Box,
  Field,
  Flex,
  Tag,
  TextInput,
  Typography,
} from "@strapi/design-system";
import { Cross } from "@strapi/icons";
import { useIntl } from "react-intl";

type NormalizeCase = "none" | "lowercase" | "uppercase";
type IntlMessage = { id?: string; defaultMessage?: string };

type TagsInputProps = {
  attribute?: {
    type?: string;
    options?: {
      maxTags?: number | string;
      maxTagLength?: number | string;
      allowDuplicates?: boolean | string;
      normalizeCase?: NormalizeCase | string;
      separator?: string;
    };
  };
  disabled?: boolean;
  description?: string | IntlMessage;
  error?: string;
  hint?: string;
  intlLabel?: IntlMessage;
  label?: string | IntlMessage;
  name: string;
  onChange: (event: {
    target: {
      name: string;
      type: string;
      value: string[];
    };
  }) => void;
  placeholder?: string;
  required?: boolean;
  value?: unknown;
};

const DEFAULT_SEPARATOR = ",";
const DEFAULT_MAX_TAGS = 20;
const DEFAULT_MAX_TAG_LENGTH = 40;

const parseTagsValue = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter((item) => item.length > 0);
  }

  if (typeof value !== "string") {
    return [];
  }

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
    // Fallback for plain string values.
  }

  return [normalized];
};

const serializeTagsValue = (tags: string[]) => tags;

const normalizeCaseValue = (rawValue: unknown): NormalizeCase => {
  if (rawValue === "lowercase" || rawValue === "uppercase") {
    return rawValue;
  }

  return "none";
};

const normalizeTag = (value: string, normalizeCase: NormalizeCase): string => {
  const cleanedValue = value.trim();

  if (!cleanedValue) {
    return "";
  }

  if (normalizeCase === "lowercase") {
    return cleanedValue.toLowerCase();
  }

  if (normalizeCase === "uppercase") {
    return cleanedValue.toUpperCase();
  }

  return cleanedValue;
};

const parseBoolean = (value: unknown, defaultValue = false): boolean => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }

  return defaultValue;
};

const parsePositiveInt = (value: unknown, fallbackValue: number): number => {
  const parsedValue = Number(value);

  if (Number.isFinite(parsedValue) && parsedValue > 0) {
    return Math.floor(parsedValue);
  }

  return fallbackValue;
};

const getSplitRegex = (separator: string) => {
  const characters = Array.from(new Set([separator, "\n", "\r"])).filter(
    (character) => character.length > 0
  );

  const escapedCharacters = characters
    .map((character) => character.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("");

  return new RegExp(`[${escapedCharacters}]+`);
};

const parseRawTags = (
  rawValue: string,
  separator: string,
  normalizeCase: NormalizeCase
) =>
  rawValue
    .split(getSplitRegex(separator))
    .map((tag) => normalizeTag(tag, normalizeCase))
    .filter((tag) => tag.length > 0);

const hasSplitCharacters = (value: string, separator: string) =>
  [separator, "\n", "\r"].some(
    (character) => character.length > 0 && value.includes(character)
  );

const TagsInput = React.forwardRef<HTMLInputElement, TagsInputProps>(
  (
    {
      attribute,
      description,
      disabled = false,
      error,
      hint,
      intlLabel,
      label,
      name,
      onChange,
      placeholder,
      required = false,
      value,
    },
    ref
  ) => {
    const { formatMessage } = useIntl();
    const [tags, setTags] = React.useState<string[]>(() => parseTagsValue(value));
    const [draft, setDraft] = React.useState("");
    const [localError, setLocalError] = React.useState<string | undefined>();

    React.useEffect(() => {
      setTags(parseTagsValue(value));
    }, [value]);

    const fieldType = attribute?.type ?? "json";
    const options = attribute?.options ?? {};
    const separator =
      typeof options.separator === "string" && options.separator.trim().length > 0
        ? options.separator.trim().charAt(0)
        : DEFAULT_SEPARATOR;
    const maxTags = parsePositiveInt(options.maxTags, DEFAULT_MAX_TAGS);
    const maxTagLength = parsePositiveInt(
      options.maxTagLength,
      DEFAULT_MAX_TAG_LENGTH
    );
    const allowDuplicates = parseBoolean(options.allowDuplicates, false);
    const normalizeCase = normalizeCaseValue(options.normalizeCase);

    const formatIntlMessage = React.useCallback(
      (message?: IntlMessage) => {
        if (!message?.id && !message?.defaultMessage) {
          return undefined;
        }

        return formatMessage({
          id: message.id ?? `${name}.label`,
          defaultMessage: message.defaultMessage ?? "Tags",
        });
      },
      [formatMessage, name]
    );

    const labelText =
      typeof label === "string"
        ? label
        : formatIntlMessage(label) ?? formatIntlMessage(intlLabel);
    const labelMessage =
      labelText && labelText.trim().length > 0 ? labelText.trim() : "Tags";

    const descriptionText =
      typeof description === "string"
        ? description
        : formatIntlMessage(description);
    const hintMessage =
      descriptionText && descriptionText.trim().length > 0
        ? descriptionText.trim()
        : hint ??
          formatMessage({
            id: "tags-input.hint",
            defaultMessage:
              "Press Enter or type the separator to add tags. Paste multiple tags at once.",
          });

    const shownError = error || localError;

    const emitChange = React.useCallback(
      (nextTags: string[]) => {
        onChange({
          target: {
            name,
            type: fieldType,
            value: serializeTagsValue(nextTags),
          },
        });
      },
      [fieldType, name, onChange]
    );

    const addTags = React.useCallback(
      (rawTags: string[]) => {
        if (rawTags.length === 0) {
          return false;
        }

        const nextTags = [...tags];
        let didChange = false;
        let nextError: string | undefined;

        for (const rawTag of rawTags) {
          if (nextTags.length >= maxTags) {
            nextError = formatMessage(
              {
                id: "tags-input.error.max-tags",
                defaultMessage: "You can only add up to {maxTags} tags.",
              },
              { maxTags }
            );
            break;
          }

          if (rawTag.length > maxTagLength) {
            nextError = formatMessage(
              {
                id: "tags-input.error.max-length",
                defaultMessage:
                  "Each tag must be at most {maxLength} characters.",
              },
              { maxLength: maxTagLength }
            );
            continue;
          }

          const duplicateIndex = nextTags.findIndex(
            (tag) => tag.toLowerCase() === rawTag.toLowerCase()
          );

          if (duplicateIndex !== -1 && !allowDuplicates) {
            nextError = formatMessage({
              id: "tags-input.error.duplicate",
              defaultMessage: "Duplicate tags are not allowed.",
            });
            continue;
          }

          nextTags.push(rawTag);
          didChange = true;
        }

        if (didChange) {
          setTags(nextTags);
          setLocalError(undefined);
          emitChange(nextTags);
        } else if (nextError) {
          setLocalError(nextError);
        }

        return didChange;
      },
      [allowDuplicates, emitChange, formatMessage, maxTagLength, maxTags, tags]
    );

    const commitDraft = React.useCallback(() => {
      const parsedTags = parseRawTags(draft, separator, normalizeCase);
      const added = addTags(parsedTags);

      if (added) {
        setDraft("");
      }
    }, [addTags, draft, normalizeCase, separator]);

    const removeTag = React.useCallback(
      (index: number) => {
        setTags((currentTags) => {
          const nextTags = currentTags.filter((_, currentIndex) => currentIndex !== index);
          emitChange(nextTags);

          return nextTags;
        });
      },
      [emitChange]
    );

    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter" || event.key === separator) {
        event.preventDefault();
        commitDraft();
      }
    };

    const onPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
      const pastedText = event.clipboardData.getData("text");

      if (!pastedText || !hasSplitCharacters(pastedText, separator)) {
        return;
      }

      event.preventDefault();
      const parsedTags = parseRawTags(pastedText, separator, normalizeCase);
      const added = addTags(parsedTags);

      if (added) {
        setDraft("");
      }
    };

    return (
      <Field.Root
        id={name}
        name={name}
        required={required}
        hint={hintMessage}
        error={shownError}
      >
        <Flex direction="column" alignItems="stretch" gap={2}>
          <Field.Label>{labelMessage}</Field.Label>
          <Field.Hint />

          {tags.length > 0 ? (
            <Box
              borderColor="neutral150"
              borderStyle="solid"
              borderWidth="1px"
              borderRadius="4px"
              padding={2}
              background="neutral0"
            >
              <Flex wrap="wrap" gap={2}>
                {tags.map((tag, index) => (
                  <Tag
                    key={`${tag}-${index}`}
                    icon={<Cross />}
                    disabled={disabled}
                    onClick={!disabled ? () => removeTag(index) : undefined}
                    label={`Remove ${tag}`}
                  >
                    {tag}
                  </Tag>
                ))}
              </Flex>
            </Box>
          ) : null}

          <TextInput
            id={name}
            ref={ref}
            disabled={disabled}
            required={required && tags.length === 0}
            value={draft}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const nextDraft = event.currentTarget.value;

              if (nextDraft.length <= maxTagLength) {
                setDraft(nextDraft);
                if (localError) {
                  setLocalError(undefined);
                }
              } else {
                setLocalError(
                  formatMessage(
                    {
                      id: "tags-input.error.max-length",
                      defaultMessage:
                        "Each tag must be at most {maxLength} characters.",
                    },
                    { maxLength: maxTagLength }
                  )
                );
              }
            }}
            onBlur={commitDraft}
            onKeyDown={onKeyDown}
            onPaste={onPaste}
            placeholder={
              placeholder ??
              formatMessage(
                {
                  id: "tags-input.placeholder",
                  defaultMessage:
                    "Type a tag and press Enter or {separator} to add it",
                },
                { separator }
              )
            }
          />

          <Flex justifyContent="space-between" gap={2}>
            <Typography variant="pi" textColor="neutral600">
              {formatMessage(
                {
                  id: "tags-input.counter.tags",
                  defaultMessage: "{count}/{maxTags} tags",
                },
                { count: tags.length, maxTags }
              )}
            </Typography>
            <Typography
              variant="pi"
              textColor={
                draft.length >= maxTagLength ? "danger600" : "neutral600"
              }
            >
              {formatMessage(
                {
                  id: "tags-input.counter.characters",
                  defaultMessage: "{count}/{maxLength} characters",
                },
                { count: draft.length, maxLength: maxTagLength }
              )}
            </Typography>
          </Flex>

          <Field.Error />
        </Flex>
      </Field.Root>
    );
  }
);

TagsInput.displayName = "TagsInput";

export { TagsInput };

