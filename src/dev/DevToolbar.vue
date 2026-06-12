<script setup lang="ts">
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useAppStore } from "@/stores/appStore";

const router = useRouter();
const appStore = useAppStore();
const { connected } = storeToRefs(appStore);

function toggleConnected() {
  appStore.setConnected(!connected.value);
}

function goOnboarding() {
  void router.push("/onboarding/welcome");
}

function goDashboard() {
  void router.push("/dashboard");
}
</script>

<template>
  <div
    class="fixed bottom-0 left-0 right-0 z-[9999] flex items-center justify-center gap-4 border-t border-amber-300 bg-amber-50 px-4 py-2 text-xs font-medium text-amber-900 shadow-lg"
  >
    <span>Dev toolbar</span>
    <button
      type="button"
      class="rounded border border-amber-400 bg-white px-2 py-1 hover:bg-amber-100"
      @click="toggleConnected"
    >
      Connected: {{ connected ? "on" : "off" }}
    </button>
    <button
      type="button"
      class="rounded border border-amber-400 bg-white px-2 py-1 hover:bg-amber-100"
      @click="goDashboard"
    >
      Dashboard
    </button>
    <button
      type="button"
      class="rounded border border-amber-400 bg-white px-2 py-1 hover:bg-amber-100"
      @click="goOnboarding"
    >
      Onboarding
    </button>
  </div>
</template>
