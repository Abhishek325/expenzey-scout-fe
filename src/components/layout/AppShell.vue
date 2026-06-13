<script setup lang="ts">
import AppNav from "@/components/layout/AppNav.vue";
import AppTopBar from "@/components/layout/AppTopBar.vue";
import FloatingChat from "@/components/chat/FloatingChat.vue";
</script>

<template>
  <div class="expenzey-ai-app min-h-screen bg-white text-slate-900">
    <AppTopBar />
    <AppNav />
    <main class="mx-auto min-h-screen max-w-7xl bg-slate-50 p-6">
      <RouterView />
    </main>
    <FloatingChat />
  </div>
</template>
