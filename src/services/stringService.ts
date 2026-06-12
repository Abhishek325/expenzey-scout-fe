import DEFAULT_STRING_MAP from "@/data/strings/en-us.json";
import { bumpLocaleRevision } from "@/services/localeRevision";

/** Values loaded from JSON string maps (strings, nested objects, or arrays). */
type LocalizedValue = string | Record<string, unknown> | unknown[] | null | undefined;

interface StringContext {
  [context: string]: Record<string, LocalizedValue>;
}

export interface IStringService {
  getStrings(context: string, key: string): string;
  getStrings(context: string, keys: readonly string[]): string[];
  getRaw(context: string, key: string): LocalizedValue | undefined;
  setStringMap(file: string): Promise<void>;
}

export const STRING_SERVICE_KEY = "stringService";

export default class StringService implements IStringService {
  private stringMap: StringContext;

  constructor() {
    this.stringMap = DEFAULT_STRING_MAP as unknown as StringContext;
  }

  getStrings(context: string, key: string): string;
  getStrings(context: string, keys: readonly string[]): string[];
  getStrings(context: string, keyOrKeys: string | readonly string[]): string | string[] {
    if (typeof keyOrKeys === "string") {
      return this.toUiString(context, keyOrKeys);
    }
    return keyOrKeys.map((k) => this.getStrings(context, k));
  }

  getRaw(context: string, key: string): LocalizedValue | undefined {
    return this.getContextValue(context, key);
  }

  private getContextValue(context: string, key: string): LocalizedValue | undefined {
    const cntx = this.stringMap[context];
    if (!cntx) {
      return undefined;
    }

    if (key in cntx) {
      return cntx[key];
    }

    if (!key.includes(".")) {
      return undefined;
    }

    const parts = key.split(".");
    let current: LocalizedValue = cntx;
    for (const part of parts) {
      if (
        current &&
        typeof current === "object" &&
        !Array.isArray(current) &&
        part in (current as Record<string, LocalizedValue>)
      ) {
        current = (current as Record<string, LocalizedValue>)[part];
      } else {
        return undefined;
      }
    }
    return current;
  }

  private toUiString(context: string, key: string): string {
    const v = this.getContextValue(context, key);
    if (v === undefined || v === null) {
      return `${context}/${key}`;
    }
    if (typeof v === "string") {
      return v;
    }
    if (typeof v === "number" || typeof v === "boolean") {
      return String(v);
    }
    return `${context}/${key}`;
  }

  public async setStringMap(file: string): Promise<void> {
    this.stringMap = (await import(`@/data/strings/${file}.json`))
      .default as unknown as StringContext;
    bumpLocaleRevision();
  }
}
