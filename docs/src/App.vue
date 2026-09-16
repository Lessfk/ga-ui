<script setup lang="ts">
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import DocsShell from './layout/DocsShell.vue'
</script>

<template>
  <ElConfigProvider :locale="zhCn">
    <DocsShell />
  </ElConfigProvider>
</template>
