<template>
  <div ref="root" class="relative">
    <button
      type="button"
      class="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
      aria-haspopup="menu"
      :aria-expanded="open"
      @click.stop="emit('toggle')"
    >
      <span class="sr-only">{{ copy["actions.menuLabel"] }}</span>
      <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <circle cx="12" cy="5" r="1.5" />
        <circle cx="12" cy="12" r="1.5" />
        <circle cx="12" cy="19" r="1.5" />
      </svg>
    </button>

    <div
      v-if="open"
      class="absolute right-0 top-full z-20 mt-1 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
      role="menu"
      @click.stop
    >
      <button
        type="button"
        class="flex w-full items-start gap-3 px-3 py-2.5 text-left hover:bg-slate-50"
        role="menuitem"
        @click="emit('markDone')"
      >
        <span class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
          <FaIcon icon="fa-check" size="sm" />
        </span>
        <span>
          <span class="block text-sm font-semibold text-slate-900">{{ copy["actions.markDone"] }}</span>
          <span class="block text-xs text-slate-500">{{ copy["actions.markDoneHint"] }}</span>
        </span>
      </button>
      <button
        type="button"
        class="flex w-full items-start gap-3 px-3 py-2.5 text-left hover:bg-slate-50"
        role="menuitem"
        @click="emit('dismiss')"
      >
        <span class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
          <FaIcon icon="fa-xmark" size="sm" />
        </span>
        <span>
          <span class="block text-sm font-semibold text-slate-900">{{ copy["actions.dismiss"] }}</span>
          <span class="block text-xs text-slate-500">{{ copy["actions.dismissHint"] }}</span>
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import FaIcon from "@/components/icons/FaIcon.vue";
import { useReactiveLocaleStringRecord } from "@/composables/useLocalizedString";

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  toggle: [];
  markDone: [];
  dismiss: [];
  close: [];
}>();

const copy = useReactiveLocaleStringRecord("opportunities", [
  "actions.menuLabel",
  "actions.markDone",
  "actions.markDoneHint",
  "actions.dismiss",
  "actions.dismissHint",
] as const);

const root = ref<HTMLElement | null>(null);

function onDocumentClick(event: MouseEvent) {
  if (!props.open) return;
  const target = event.target as Node;
  if (root.value && !root.value.contains(target)) {
    emit("close");
  }
}

function onDocumentKeydown(event: KeyboardEvent) {
  if (props.open && event.key === "Escape") {
    emit("close");
  }
}

onMounted(() => {
  document.addEventListener("click", onDocumentClick, true);
  document.addEventListener("keydown", onDocumentKeydown);
});

onUnmounted(() => {
  document.removeEventListener("click", onDocumentClick, true);
  document.removeEventListener("keydown", onDocumentKeydown);
});
</script>
