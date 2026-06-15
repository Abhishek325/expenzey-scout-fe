<template>
  <div class="expenzey-ai-app min-h-screen bg-white text-slate-900">
    <AppTopBar />
    <main class="mx-auto min-h-screen max-w-7xl bg-slate-50 px-6 py-2">
      <RouterView />
    </main>
    <FloatingChat />
  </div>
</template>

<script setup lang="ts">
import AppTopBar from "@/components/layout/AppTopBar.vue";
import FloatingChat from "@/components/chat/FloatingChat.vue";
</script>
