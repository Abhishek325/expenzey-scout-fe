import type { ComputedRef, Ref } from "vue";

export interface DashboardWidgetState {
  loading: Ref<boolean>;
  error: Ref<string | null>;
  hasData: ComputedRef<boolean>;
  reload: () => Promise<void>;
}

export type DashboardCardAction =
  | { kind: "link"; to: string; label: Ref<string> | string }
  | { kind: "button"; label: Ref<string> | string; onClick: () => void };

export function isActionDisabled(
  loading: boolean,
  error: string | null,
  hasData: boolean
): boolean {
  return loading || !!error || !hasData;
}
