import { defineStore } from "pinia";

export const useChatOverlayStore = defineStore("chatOverlay", {
  state: () => ({
    isOpen: false,
    pendingPrompt: null as string | null,
  }),
  actions: {
    openWithPrompt(prompt: string) {
      this.pendingPrompt = prompt.trim();
      this.isOpen = true;
    },
    open() {
      this.isOpen = true;
    },
    close() {
      this.isOpen = false;
    },
    clearPending() {
      this.pendingPrompt = null;
    },
  },
});
