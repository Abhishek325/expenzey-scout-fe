<template>
  <section
    v-if="relatedOpportunities.length > 0"
    class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
  >
    <h3 class="text-sm font-semibold text-slate-900">
      {{ copy["drawer.related"] }}
    </h3>
    <ul class="mt-3 flex flex-col gap-2">
      <li v-for="related in relatedOpportunities" :key="related.id">
        <button
          type="button"
          class="flex w-full items-start gap-2.5 rounded-lg border border-slate-100 bg-white px-3 py-2.5 text-left transition hover:border-indigo-100 hover:bg-indigo-50/30"
          @click="emit('selectRelated', related.id)"
        >
          <div
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
            :class="TYPE_ICON_CLASSES[related.type] ?? 'bg-slate-100 text-slate-600'"
          >
            <FaIcon :icon="TYPE_ICONS[related.type] ?? 'fa-lightbulb'" size="xs" />
          </div>
          <div class="min-w-0">
            <p
              class="text-[10px] font-semibold"
              :class="badgeStyle(related.badge).labelClass"
            >
              {{ related.badge }}
            </p>
            <p class="mt-0.5 line-clamp-2 text-xs font-medium text-slate-800">
              {{ related.title }}
            </p>
          </div>
        </button>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import FaIcon from "@/components/icons/FaIcon.vue";
import { useOpportunitiesStore } from "@/stores/opportunitiesStore";
import { useReactiveLocaleStringRecord } from "@/composables/useLocalizedString";
import type { OpportunityDetail } from "@/types/ai";
import { TYPE_ICON_CLASSES, TYPE_ICONS, badgeStyle } from "@/utils/opportunityStyles";

const props = defineProps<{
  opportunity: OpportunityDetail;
}>();

const emit = defineEmits<{
  selectRelated: [id: string];
}>();

const store = useOpportunitiesStore();

const copy = useReactiveLocaleStringRecord("opportunities", ["drawer.related"] as const);

const relatedOpportunities = computed(() =>
  props.opportunity.relatedIds
    .slice(0, 3)
    .map((id) => store.byId.get(id))
    .filter((item): item is OpportunityDetail => item != null && item.id !== props.opportunity.id),
);
</script>
