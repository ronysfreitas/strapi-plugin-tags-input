import * as React from "react";
import { useIntl } from "react-intl";

type TagsInputProps = {
  attribute?: {
    type?: string;
  };
  disabled?: boolean;
  error?: string;
  hint?: string;
  intlLabel?: {
    id?: string;
    defaultMessage?: string;
  };
  name: string;
  onChange: (event: {
    target: {
      name: string;
      type: string;
      value: string;
    };
  }) => void;
  placeholder?: string;
  required?: boolean;
  value?: string | null;
};

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
    // Fallback for legacy comma-separated values.
  }

  return normalized
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
};

const serializeTagsValue = (tags: string[]) => JSON.stringify(tags);

const containerStyle: React.CSSProperties = {
  display: "grid",
  gap: "8px",
};

const tagsRowStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
};

const tagStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  border: "1px solid #d9d8ff",
  borderRadius: "999px",
  padding: "4px 10px",
  background: "#f6f6ff",
  color: "#32324d",
  fontSize: "12px",
};

const removeButtonStyle: React.CSSProperties = {
  border: "none",
  background: "transparent",
  cursor: "pointer",
  color: "#666687",
  padding: 0,
  lineHeight: 1,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid #dcdce4",
  borderRadius: "4px",
  padding: "8px 10px",
  fontSize: "14px",
};

const messageStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "12px",
  color: "#666687",
};

const errorStyle: React.CSSProperties = {
  ...messageStyle,
  color: "#d02b20",
};

const TagsInput = React.forwardRef<HTMLInputElement, TagsInputProps>(
  (
    {
      attribute,
      disabled = false,
      error,
      hint,
      intlLabel,
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

    React.useEffect(() => {
      setTags(parseTagsValue(value));
    }, [value]);

    const fieldType = attribute?.type ?? "text";
    const label =
      intlLabel?.id || intlLabel?.defaultMessage
        ? formatMessage({
            id: intlLabel?.id ?? `${name}.label`,
            defaultMessage: intlLabel?.defaultMessage ?? "Tags",
          })
        : "Tags";

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

    const addTag = React.useCallback(
      (rawTag: string) => {
        const nextTag = rawTag.trim();

        if (!nextTag) {
          return;
        }

        setTags((currentTags) => {
          const alreadyExists = currentTags.some(
            (tag) => tag.toLowerCase() === nextTag.toLowerCase()
          );

          if (alreadyExists) {
            return currentTags;
          }

          const nextTags = [...currentTags, nextTag];
          emitChange(nextTags);

          return nextTags;
        });
      },
      [emitChange]
    );

    const commitDraft = React.useCallback(() => {
      addTag(draft);
      setDraft("");
    }, [addTag, draft]);

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
      if (event.key === "Enter" || event.key === ",") {
        event.preventDefault();
        commitDraft();
      }
    };

    return (
      <div style={containerStyle}>
        <label htmlFor={name}>{label}</label>

        {tags.length > 0 ? (
          <div style={tagsRowStyle}>
            {tags.map((tag, index) => (
              <span key={`${tag}-${index}`} style={tagStyle}>
                {tag}
                {!disabled ? (
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    style={removeButtonStyle}
                    aria-label={`Remove ${tag}`}
                  >
                    x
                  </button>
                ) : null}
              </span>
            ))}
          </div>
        ) : null}

        <input
          id={name}
          ref={ref}
          type="text"
          disabled={disabled}
          required={required && tags.length === 0}
          value={draft}
          onChange={(event) => setDraft(event.currentTarget.value)}
          onBlur={commitDraft}
          onKeyDown={onKeyDown}
          placeholder={placeholder ?? "Type a tag and press Enter or comma"}
          style={inputStyle}
        />

        {hint ? <p style={messageStyle}>{hint}</p> : null}
        {error ? <p style={errorStyle}>{error}</p> : null}
      </div>
    );
  }
);

TagsInput.displayName = "TagsInput";

export { TagsInput };

