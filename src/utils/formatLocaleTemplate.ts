export function ensureLocaleString(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }
  if (value == null) {
    return "";
  }
  if (typeof value === "object" && value !== null && "value" in value) {
    return ensureLocaleString((value as { value: unknown }).value);
  }
  return String(value);
}

export function formatLocaleTemplate(
  template: unknown,
  replacements: Record<string, string | number>
): string {
  let text = ensureLocaleString(template);
  for (const [key, value] of Object.entries(replacements)) {
    text = text.split(`{${key}}`).join(String(value));
  }
  return text;
}
