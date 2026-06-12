import type { Pinia } from "pinia";
import type { IStringService } from "@/services/stringService";
import { useAppStore } from "@/stores/appStore";
import type { ExpenzeyAiConfig } from "@/types/wp";

export function getWpConfig(): ExpenzeyAiConfig | undefined {
  return window.expenzeyAi;
}

async function applyLocale(stringService: IStringService, locale: string): Promise<void> {
  const normalized = locale.toLowerCase();
  if (normalized === "en-us" || normalized === "en") {
    return;
  }

  try {
    await stringService.setStringMap(normalized);
  } catch {
    /* Fall back to bundled en-us strings */
  }
}

/**
 * Apply WordPress-localized config to Pinia and optional locale strings.
 */
export async function applyWpBootstrap(
  pinia: Pinia,
  stringService: IStringService
): Promise<void> {
  const config = getWpConfig();
  if (!config) {
    return;
  }

  const appStore = useAppStore(pinia);
  appStore.applyWpConfig({
    connected: config.connected,
    siteUrl: config.siteUrl,
    installationId: config.installationId,
    lastSync: config.lastSync,
  });

  await applyLocale(stringService, config.locale);
}
