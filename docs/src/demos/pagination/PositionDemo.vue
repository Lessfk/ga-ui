<template>
  <div class="position-demo">
    <GaPagination :total="100" position="left" />
    <GaPagination :total="100" position="center" />
    <GaPagination :total="100" position="right" />
  </div>
</template>

<script setup lang="ts">
import { GaPagination } from 'ga-ui-plus/base'
</script>

<style scoped>
.position-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
