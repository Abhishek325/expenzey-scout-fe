import type { Pinia } from "pinia";
import type { IStringService } from "@/services/stringService";
import { useAppStore } from "@/stores/appStore";
import type { WpConnectionConfig } from "@/stores/appStore";
import type { ExpenzeyAiConfig } from "@/types/wp";
import { parseWpBoolean } from "@/services/wp/wpConfigUtils";

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
    connected: parseWpBoolean(config.connected),
    siteUrl: config.siteUrl,
    installationId: config.installationId,
    lastSync: config.lastSync,
    accountStatus: (config.accountStatus as WpConnectionConfig["accountStatus"]) ?? "active",
    syncStatus: (config.syncStatus as WpConnectionConfig["syncStatus"]) ?? "idle",
    currency: config.currency ?? "USD",
    locale: config.locale,
  });

  await applyLocale(stringService, config.locale);
}
