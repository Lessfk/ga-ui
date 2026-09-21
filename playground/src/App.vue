<template>
  <div class="playground-scroll">
    <HeaderDemo />
  </div>
</template>

<script setup lang="ts">
import HeaderDemo from './demos/HeaderDemo.vue'
</script>

<style scoped>
.playground-scroll {
  height: 100%;
  overflow: auto;
}
</style>
