<template>
  <div
    class="bg-slate-200/70"
    :class="[
      rounded ? 'rounded' : '',
      pill ? 'rounded-full' : '',
      className,
    ]"
    aria-hidden="true"
  />
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    className?: string;
    rounded?: boolean;
    pill?: boolean;
  }>(),
  { className: "", rounded: true, pill: false }
);
</script>

