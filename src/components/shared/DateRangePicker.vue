<template>
  <div ref="rootRef" class="relative inline-block">
    <button
      type="button"
      class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
      @click.stop="toggle"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="h-4 w-4 text-slate-500"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
        />
      </svg>
      <span>{{ label }}</span>
    </button>

    <div
      v-if="open"
      class="absolute right-0 z-30 mt-2 w-[min(100vw-2rem,22rem)] rounded-xl border border-slate-200 bg-white p-4 shadow-xl"
      @click.stop
    >
      <div class="mb-3 flex flex-wrap gap-2">
        <button
          v-for="p in DATE_RANGE_PRESETS"
          :key="p"
          type="button"
          class="rounded-full border px-3 py-1 text-xs font-medium transition"
          :class="
            preset === p
              ? 'border-expenzey-500 bg-expenzey-50 text-expenzey-700'
              : 'border-slate-200 bg-white text-slate-600 hover:border-expenzey-200 hover:bg-expenzey-50'
          "
          @click="selectPreset(p)"
        >
          {{ labels[p] }}
        </button>
      </div>

      <DatePicker
        v-model="calendarRange"
        mode="date"
        is-range
        :max-date="maxDate"
        borderless
        transparent
        expanded
        class="expenzey-date-picker"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { DatePicker } from "v-calendar";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { DATE_RANGE_PRESETS, useDateRangeStore } from "@/stores/dateRange";
import { useReactiveLocaleStringRecord } from "@/composables/useLocalizedString";
import type { DateRangePreset } from "@/types/metrics";
import dayjs from "dayjs";

const emit = defineEmits<{
  change: [preset: DateRangePreset | null];
}>();

const dateRange = useDateRangeStore();
const { label, start, end, preset } = storeToRefs(dateRange);
const labels = useReactiveLocaleStringRecord("dateRange", ["7d", "30d", "90d", "12mo"] as const);

const rootRef = ref<HTMLElement | null>(null);
const open = ref(false);
const calendarRange = ref<{ start: Date; end: Date }>({
  start: start.value,
  end: end.value,
});

watch([start, end], ([s, e]) => {
  calendarRange.value = { start: s, end: e };
});

watch(
  calendarRange,
  (val) => {
    if (val?.start && val?.end) {
      applyCalendarRange(val);
    }
  },
  { deep: true }
);

function selectPreset(p: DateRangePreset) {
  dateRange.setPreset(p);
  emit("change", p);
}

function applyCalendarRange(value: { start?: Date; end?: Date }) {
  if (!value.start || !value.end) {
    return;
  }
  const unchanged =
    value.start.getTime() === start.value.getTime() &&
    value.end.getTime() === end.value.getTime();
  if (unchanged) {
    return;
  }
  dateRange.setCustomRange(value.start, value.end);
  emit("change", null);
}

function toggle() {
  open.value = !open.value;
}

function onDocumentClick(event: MouseEvent) {
  if (!open.value || !rootRef.value) {
    return;
  }
  if (!rootRef.value.contains(event.target as Node)) {
    open.value = false;
  }
}

onMounted(() => document.addEventListener("click", onDocumentClick));
onBeforeUnmount(() => document.removeEventListener("click", onDocumentClick));

const maxDate = computed(() => dayjs().endOf("day").toDate());
</script>

<style scoped>
:deep(.expenzey-date-picker .vc-container) {
  border: none;
  width: 100%;
  font-family: inherit;
}

:deep(.expenzey-date-picker .vc-highlight-bg-solid) {
  background-color: #4f46e5;
}

:deep(.expenzey-date-picker .vc-highlight-content-solid) {
  color: white;
}
</style>
