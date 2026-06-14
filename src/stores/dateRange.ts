import dayjs from "dayjs";
import { defineStore } from "pinia";
import type { DateRangePreset, DateRangeSelection } from "@/types/metrics";
import {
  formatDashboardDateRangeLabel,
  getRangeForPreset,
} from "@/utils/dateRangeUtils";

export const DATE_RANGE_PRESETS: readonly DateRangePreset[] = [
  "7d",
  "30d",
  "90d",
  "12mo",
] as const;

export const useDateRangeStore = defineStore("dateRange", {
  state: () => {
    const defaultRange = getRangeForPreset("7d");
    return {
      start: defaultRange.start,
      end: defaultRange.end,
      preset: "7d" as DateRangePreset | null,
      isCustom: false,
    };
  },
  getters: {
    label: (state) => formatDashboardDateRangeLabel(state.start, state.end),
    rangeKey: (state) =>
      `${state.start.getTime()}-${state.end.getTime()}-${state.preset ?? "custom"}`,
    days: (state) =>
      dayjs(state.end).startOf("day").diff(dayjs(state.start).startOf("day"), "day") + 1,
    selection: (state): DateRangeSelection => ({
      start: state.start,
      end: state.end,
      preset: state.preset,
    }),
  },
  actions: {
    setPreset(preset: DateRangePreset) {
      const range = getRangeForPreset(preset);
      this.start = range.start;
      this.end = range.end;
      this.preset = preset;
      this.isCustom = false;
    },
    setCustomRange(start: Date, end: Date) {
      const s = dayjs(start).startOf("day");
      const e = dayjs(end).startOf("day");
      if (!s.isValid() || !e.isValid() || s.isAfter(e)) {
        return;
      }
      if (s.isSame(e, "day")) {
        return;
      }
      this.start = s.toDate();
      this.end = e.endOf("day").toDate();
      this.preset = null;
      this.isCustom = true;
    },
    syncCalendarRange(range: { start?: Date | null; end?: Date | null }) {
      if (range.start && range.end) {
        this.setCustomRange(range.start, range.end);
      }
    },
  },
});
