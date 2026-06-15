<template>
  <i :class="['fa-solid', icon, sizeClass[size], iconClass]" aria-hidden="true" />
</template>

<script setup lang="ts">
const sizeClass = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
} as const;

withDefaults(
  defineProps<{
    icon: string;
    size?: keyof typeof sizeClass;
    iconClass?: string;
  }>(),
  { size: "sm" }
);
</script>
