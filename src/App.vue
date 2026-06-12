<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import AppShell from "@/components/layout/AppShell.vue";
import OnboardingLayout from "@/views/OnboardingLayout.vue";
import DevToolbar from "@/dev/DevToolbar.vue";

const route = useRoute();

const isOnboarding = computed(() => route.path.startsWith("/onboarding"));
const showDevToolbar = import.meta.env.DEV;
</script>

<template>
  <div class="expenzey-ai-app min-h-full">
    <OnboardingLayout v-if="isOnboarding" />
    <AppShell v-else />
    <DevToolbar v-if="showDevToolbar" />
  </div>
</template>
