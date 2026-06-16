<template>
  <div ref="root">
    <slot v-if="shouldRender" />
    <slot v-else name="fallback" />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const props = withDefaults(
  defineProps<{
    /**
     * When true, render immediately and skip IntersectionObserver.
     */
    disabled?: boolean;
    /**
     * When true, the widget stays mounted after first visibility.
     */
    once?: boolean;
    /**
     * Preload distance before it enters viewport.
     */
    rootMargin?: string;
  }>(),
  { disabled: false, once: true, rootMargin: "200px" }
);

const root = ref<HTMLElement | null>(null);
const visible = ref(false);
let observer: IntersectionObserver | null = null;

const shouldRender = computed(() => props.disabled || visible.value);

onMounted(() => {
  if (props.disabled) {
    visible.value = true;
    return;
  }

  if (!("IntersectionObserver" in window)) {
    visible.value = true;
    return;
  }

  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (!entry) return;
      if (entry.isIntersecting || entry.intersectionRatio > 0) {
        visible.value = true;
        if (props.once) {
          observer?.disconnect();
          observer = null;
        }
      }
    },
    { root: null, rootMargin: props.rootMargin, threshold: 0.01 }
  );

  if (root.value) observer.observe(root.value);
});

onBeforeUnmount(() => {
  observer?.disconnect();
  observer = null;
});
</script>

