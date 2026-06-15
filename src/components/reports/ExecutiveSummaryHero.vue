<template>
  <section class="rounded-xl border border-violet-100 bg-violet-50/70 p-5 shadow-sm">
    <div class="flex gap-4">
      <span
        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white"
        aria-hidden="true"
      >
        <FaIcon icon="fa-wand-magic-sparkles" size="sm" />
      </span>
      <div class="min-w-0 flex-1">
        <p class="text-xs font-bold uppercase tracking-wide text-violet-700">{{ title }}</p>
        <ul v-if="bullets.length" class="mt-3 space-y-2">
          <li
            v-for="(bullet, index) in bullets"
            :key="index"
            class="text-sm leading-relaxed text-slate-800"
          >
            {{ bullet }}
          </li>
        </ul>
        <p v-else class="mt-3 text-sm text-slate-500">{{ emptyLabel }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import FaIcon from "@/components/icons/FaIcon.vue";
import { useLocalizedString } from "@/composables/useLocalizedString";
import { splitExecutiveSummary } from "@/utils/reportFormatters";

const props = defineProps<{ title: string; summary: string }>();

const emptyLabel = useLocalizedString("reports", "detail.noData");
const bullets = computed(() => splitExecutiveSummary(props.summary));
</script>
