import { defineAsyncComponent, ref, type Component, type Ref } from "vue";

export interface LazyWidgetResult {
  component: Component;
  isLoading: Ref<boolean>;
}

export function useLazyWidget(
  loader: () => Promise<{ default: Component } | Component>
): LazyWidgetResult {
  const isLoading = ref(true);

  const component = defineAsyncComponent({
    loader: async () => {
      try {
        const mod = await loader();
        return "default" in mod ? mod.default : mod;
      } finally {
        isLoading.value = false;
      }
    },
  });

  return { component, isLoading };
}
