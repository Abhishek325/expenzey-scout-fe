import { computed, inject, ref, watch, type Ref } from "vue";
import { localeRevision } from "@/services/localeRevision";
import { STRING_SERVICE_KEY, type IStringService } from "@/services/stringService";

export function useLocalizedString(context: string, key: string) {
  const stringService = inject(STRING_SERVICE_KEY) as IStringService;
  return computed(() => {
    void localeRevision.value;
    return stringService.getStrings(context, key);
  });
}

function useReactiveLocaleString(context: string, key: string): Ref<string>;
function useReactiveLocaleString(context: string, keys: readonly string[]): Ref<string[]>;
function useReactiveLocaleString(
  context: string,
  keyOrKeys: string | readonly string[]
): Ref<string> | Ref<string[]> {
  const stringService = inject(STRING_SERVICE_KEY) as IStringService;

  function resolve(): string | string[] {
    return typeof keyOrKeys === "string"
      ? stringService.getStrings(context, keyOrKeys)
      : stringService.getStrings(context, keyOrKeys);
  }

  const value = ref(resolve()) as Ref<string> | Ref<string[]>;
  watch(localeRevision, () => {
    value.value = resolve() as typeof value.value;
  });
  return value;
}

/** Locale strings keyed by string id (avoids index math on batched `getStrings`). */
export function useReactiveLocaleStringRecord<const K extends readonly string[]>(
  context: string,
  keys: K
): Ref<Record<K[number], string>> {
  const batch = useReactiveLocaleString(context, keys) as Ref<string[]>;

  return computed(() => {
    const values = batch.value;
    const record = {} as Record<K[number], string>;
    keys.forEach((key, index) => {
      record[key as K[number]] = values[index] ?? "";
    });
    return record;
  });
}
