import type { IStringService } from "@/services/stringService";

export function resolveStringKey(service: IStringService, dottedKey: string): string {
  const parts = dottedKey.split(".");
  if (parts.length < 2) {
    return dottedKey;
  }
  const [context, ...rest] = parts;
  const nestedKey = rest.join(".");
  const result = service.getStrings(context, nestedKey);
  return result === `${context}/${nestedKey}` ? dottedKey : result;
}
