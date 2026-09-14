<script setup lang="ts">
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import DefaultTheme from 'vitepress/theme'
</script>

<template>
  <ElConfigProvider :locale="zhCn">
    <DefaultTheme.Layout />
  </ElConfigProvider>
</template>
