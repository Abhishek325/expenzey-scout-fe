<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    :class="iconClass"
    aria-hidden="true"
  >
    <path d="M3 3v18h18" />
    <path d="M7 16l4-8 4 5 5-7" />
  </svg>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    iconClass?: string;
  }>(),
  {
    iconClass: "h-5 w-5",
  }
);
</script>
