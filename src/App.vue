<template>
  <div class="expenzey-ai-app min-h-full">
    <OnboardingLayout v-if="isOnboarding" />
    <AppShell v-else />
    <DevToolbar v-if="showDevToolbar" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { isOnboardingPath } from "@/constants/routes";
import AppShell from "@/components/layout/AppShell.vue";
import OnboardingLayout from "@/views/OnboardingLayout.vue";
import DevToolbar from "@/dev/DevToolbar.vue";

const route = useRoute();

const isOnboarding = computed(() => isOnboardingPath(route.path));
const showDevToolbar = import.meta.env.DEV;
</script>
