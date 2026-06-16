<template>
  <div class="pointer-events-none fixed inset-0 z-[10000]">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-3 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-3 scale-95"
    >
      <div
        v-if="isOpen"
        class="pointer-events-auto fixed right-6 z-[10001] flex w-[min(100vw-3rem,28rem)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
        :class="panelBottomClass"
        style="height: min(32rem, calc(100vh - 7rem))"
      >
        <AIChatWidget floating :initial-prompt="pendingPrompt" @close="close" />
      </div>
    </Transition>

    <button
      type="button"
      class="pointer-events-auto fixed right-6 z-[10002] flex h-14 w-14 items-center justify-center rounded-full bg-expenzey-600 text-white shadow-lg transition hover:bg-expenzey-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-expenzey-400 focus:ring-offset-2"
      :class="fabBottomClass"
      :aria-label="isOpen ? closeLabel : openLabel"
      :aria-expanded="isOpen"
      @click="toggle"
    >
      <ExpenzeyIcon v-if="!isOpen" icon-class="h-6 w-6" />
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="h-6 w-6"
        aria-hidden="true"
      >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import { storeToRefs } from "pinia";
import AIChatWidget from "@/components/dashboard/AIChatWidget.vue";
import ExpenzeyIcon from "@/components/icons/ExpenzeyIcon.vue";
import { useLocalizedString } from "@/composables/useLocalizedString";
import { useChatOverlayStore } from "@/stores/chatOverlay";

const chatOverlay = useChatOverlayStore();
const { isOpen, pendingPrompt } = storeToRefs(chatOverlay);

const openLabel = useLocalizedString("chat", "openChat");
const closeLabel = useLocalizedString("chat", "closeChat");

const fabBottomClass = computed(() =>
  import.meta.env.DEV ? "bottom-14" : "bottom-6"
);

const panelBottomClass = computed(() =>
  import.meta.env.DEV ? "bottom-[5.5rem]" : "bottom-24"
);

watch(isOpen, (value) => {
  if (!value) {
    chatOverlay.clearPending();
  }
});

function toggle() {
  if (isOpen.value) {
    chatOverlay.close();
  } else {
    chatOverlay.open();
  }
}

function close() {
  chatOverlay.close();
}
</script>
