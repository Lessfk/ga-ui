<template>
  <pre class="code-block"><code>{{ code }}</code></pre>
</template>

<script setup lang="ts">
defineProps<{
  code: string
}>()
</script>

<style scoped lang="scss">
.code-block {
  margin: 0 0 20px;
  padding: 16px 20px;
  overflow-x: auto;
  color: #303133;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 13px;
  line-height: 1.7;
  background: #f8fafc;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
}
</style>
