<script setup lang="ts">
import { computed, unref } from "vue";
import CardHeaderAction from "@/components/shared/CardHeaderAction.vue";
import { useLocalizedString } from "@/composables/useLocalizedString";
import { isActionDisabled, type DashboardCardAction } from "@/types/dashboardWidget";

const props = withDefaults(
  defineProps<{
    title: string;
    loading: boolean;
    error: string | null;
    hasData: boolean;
    emptyLabel?: string;
    action?: DashboardCardAction;
    fillHeight?: boolean;
    bodyClass?: string;
    sectionClass?: string;
    sectionPadding?: boolean;
  }>(),
  {
    fillHeight: false,
    bodyClass: "",
    sectionClass: "",
    sectionPadding: false,
    emptyLabel: "",
  }
);

const emit = defineEmits<{ retry: [] }>();

const loadingLabel = useLocalizedString("common", "loading");
const errorLabel = useLocalizedString("common", "error");
const retryLabel = useLocalizedString("common", "retry");

const actionDisabled = computed(() =>
  isActionDisabled(props.loading, props.error, props.hasData)
);

const actionLabel = computed(() => (props.action ? unref(props.action.label) : ""));

const sectionClasses = computed(() => [
  "rounded-xl border border-slate-200 bg-white shadow-sm",
  props.fillHeight ? "flex h-full min-h-0 flex-col overflow-hidden" : "",
  props.sectionPadding ? "p-5" : "",
  props.sectionClass,
]);

const headerClasses = computed(() =>
  props.sectionPadding
    ? "mb-4 flex items-center justify-between gap-2"
    : "flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-2.5"
);

const bodyWrapperClasses = computed(() => [
  props.fillHeight ? "min-h-0 flex-1 overflow-y-auto" : "",
  !props.sectionPadding ? "p-4" : "",
  props.bodyClass,
]);
</script>

<template>
  <section :class="sectionClasses">
    <div :class="headerClasses">
      <h3 class="text-sm font-semibold text-slate-900">{{ title }}</h3>
      <CardHeaderAction
        v-if="action?.kind === 'link'"
        :to="action.to"
        :disabled="actionDisabled"
      >
        {{ actionLabel }}
      </CardHeaderAction>
      <CardHeaderAction
        v-else-if="action?.kind === 'button'"
        :disabled="actionDisabled"
        @click="action.onClick"
      >
        {{ actionLabel }}
      </CardHeaderAction>
    </div>

    <div :class="bodyWrapperClasses">
      <p v-if="loading" class="text-sm text-slate-500">{{ loadingLabel }}</p>
      <div v-else-if="error" class="flex items-center gap-3 text-sm text-rose-600">
        <span>{{ errorLabel }}</span>
        <button type="button" class="font-medium underline" @click="emit('retry')">
          {{ retryLabel }}
        </button>
      </div>
      <p v-else-if="!hasData && !$slots.empty" class="text-sm text-slate-500">{{ emptyLabel }}</p>
      <slot v-else-if="!hasData" name="empty" />
      <slot v-else />
    </div>
  </section>
</template>
