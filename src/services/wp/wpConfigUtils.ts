import type { DataSource } from "@/services/createServices";

/** wp_localize_script may pass booleans as "1", "", or strings. */
export function parseWpBoolean(value: unknown): boolean {
  if (value === true || value === 1) {
    return true;
  }
  if (value === false || value === 0 || value === "" || value == null) {
    return false;
  }
  if (typeof value === "string") {
    const normalized = value.toLowerCase();
    return normalized === "1" || normalized === "true";
  }
  return Boolean(value);
}

export function parseDataSource(value: unknown): DataSource {
  return value === "api" ? "api" : "mock";
}
