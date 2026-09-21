<template>
  <ElButton type="primary" @click="visible = true">自定义标题栏</ElButton>

  <GaDialog v-model="visible" width="640px">
    <template #header="{ close, titleId, titleClass }">
      <div class="dialog-header">
        <span :id="titleId" :class="titleClass">编辑用户</span>
        <ElButton link @click="close">关闭</ElButton>
      </div>
    </template>

    <p>用户表单由业务组件自行渲染。</p>

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

<style scoped>
.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
