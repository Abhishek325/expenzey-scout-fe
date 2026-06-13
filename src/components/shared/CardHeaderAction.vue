<script setup lang="ts">
defineProps<{
  disabled?: boolean;
  to?: string;
}>();

const emit = defineEmits<{ click: [] }>();
</script>

<template>
  <RouterLink v-if="to && !disabled" :to="to" class="card-header-action">
    <slot />
  </RouterLink>
  <span
    v-else-if="disabled"
    class="card-header-action card-header-action--disabled"
    aria-disabled="true"
  >
    <slot />
  </span>
  <button v-else type="button" class="card-header-action" @click="emit('click')">
    <slot />
  </button>
</template>
