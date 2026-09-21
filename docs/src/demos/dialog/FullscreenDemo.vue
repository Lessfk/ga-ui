<template>
  <ElButton type="primary" @click="visible = true">全屏切换示例</ElButton>

  <GaDialog
    v-model="visible"
    v-model:fullscreen="fullscreen"
    title="编辑用户"
  >
    <p>{{ fullscreen ? '当前为全屏状态' : '当前为普通状态' }}</p>
  </GaDialog>
</template>

<script setup lang="ts">
import { ElButton } from 'element-plus'
import { ref } from 'vue'

import { GaDialog } from 'ga-ui-plus/base'

const visible = ref(false)
const fullscreen = ref(false)
</script>
