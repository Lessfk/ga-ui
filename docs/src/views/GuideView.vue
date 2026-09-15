<script setup lang="ts">
defineProps<{ slug: string }>()
</script>

<template>
  <main class="ga-docs-page">
    <h1>使用指南</h1>
    <p>当前指南：{{ slug }}</p>
  </main>
</template>
