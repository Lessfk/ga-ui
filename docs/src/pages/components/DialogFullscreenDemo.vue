<template>
  <ElButton type="primary" @click="visible = true">体验全屏切换</ElButton>

  <GaDialog
    v-model="visible"
    v-model:fullscreen="fullscreen"
    title="全屏切换"
    width="600px"
    @closed="fullscreen = false"
  >
    <p>点击标题栏右侧的全屏按钮，可以在普通与全屏状态之间切换。</p>
    <p>当前状态：{{ fullscreen ? '全屏' : '普通' }}</p>

    <template #footer>
      <ElButton @click="visible = false">关闭</ElButton>
    </template>
  </GaDialog>
</template>

<script setup lang="ts">
import { ElButton } from 'element-plus'
import { ref } from 'vue'
import { GaDialog } from 'ga-ui-plus/base'

const visible = ref(false)
const fullscreen = ref(false)
</script>
