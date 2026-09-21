<template>
  <ElButton type="primary" @click="visible = true">打开对话框</ElButton>

  <GaDialog v-model="visible" title="编辑用户" width="520px">
    <p>在这里放置对话框内容。</p>

    <template #footer>
      <ElButton @click="visible = false">取消</ElButton>
      <ElButton type="primary" @click="visible = false">保存</ElButton>
    </template>
  </GaDialog>
</template>

<script setup lang="ts">
import { ElButton } from 'element-plus'
import { ref } from 'vue'

import { GaDialog } from 'ga-ui-plus/base'

const visible = ref(false)
</script>
