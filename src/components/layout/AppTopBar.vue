<script setup lang="ts">
import { useReactiveLocaleStringRecord } from "@/composables/useLocalizedString";

const copy = useReactiveLocaleStringRecord("layout", [
  "brandName",
  "tagline",
  "storeSwitcher",
  "proPlan",
  "notifications",
] as const);
</script>

<template>
  <header
    class="flex w-full items-center justify-between border-b border-slate-200 bg-white px-6 py-3"
  >
    <div class="flex min-w-0 flex-1 items-center gap-8">
      <div class="flex items-center gap-3">
        <div
          class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-expenzey-600 text-white shadow-sm"
          aria-hidden="true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-5 w-5"
          >
            <path d="M3 3v18h18" />
            <path d="M7 16l4-8 4 5 5-7" />
          </svg>
        </div>
        <div class="min-w-0">
          <p class="text-sm font-semibold lowercase tracking-tight text-slate-900">
            {{ copy.brandName }}
          </p>
          <p class="text-xs text-slate-500">{{ copy.tagline }}</p>
        </div>
      </div>
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
      >
        {{ copy.storeSwitcher }}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          class="h-4 w-4 text-slate-400"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
    <div class="flex shrink-0 items-center gap-3">
      <button
        type="button"
        class="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-3 py-1.5 text-sm font-semibold text-amber-950 shadow-sm transition hover:bg-amber-500"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="h-4 w-4"
          aria-hidden="true"
        >
          <path
            d="M12 2l2.4 7.4H22l-6 4.6 2.3 7-6.3-4.6L5.7 21l2.3-7L2 9.4h7.6L12 2z"
          />
        </svg>
        {{ copy.proPlan }}
      </button>
      <button
        type="button"
        class="relative rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
        :aria-label="copy.notifications"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="h-5 w-5"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
          />
        </svg>
        <span
          class="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"
          aria-hidden="true"
        />
      </button>
      <div
        class="flex h-9 w-9 items-center justify-center rounded-full bg-expenzey-600 text-sm font-semibold text-white"
        aria-hidden="true"
      >
        A
      </div>
    </div>
  </header>
</template>
