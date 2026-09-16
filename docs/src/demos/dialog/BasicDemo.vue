<script setup lang="ts">
import { reactive, ref } from 'vue'

const visible = ref(false)
const fullscreen = ref(false)
const form = reactive({
  name: '张三',
  enabled: true,
})
</script>

<template>
  <div class="ga-doc-actions">
    <ElButton type="primary" @click="visible = true">打开对话框</ElButton>
    <span class="ga-doc-note">
      当前模式：{{ fullscreen ? '全屏' : '普通' }}
    </span>
  </div>

  <GaDialog
    v-model="visible"
    v-model:fullscreen="fullscreen"
    title="编辑用户"
    width="560px"
  >
    <ElForm :model="form" label-width="80px">
      <ElFormItem label="用户名">
        <ElInput v-model="form.name" />
      </ElFormItem>
      <ElFormItem label="状态">
        <ElSwitch v-model="form.enabled" />
      </ElFormItem>
    </ElForm>

    <template #footer>
      <ElButton @click="visible = false">取消</ElButton>
      <ElButton type="primary" @click="visible = false">保存</ElButton>
    </template>
  </GaDialog>
</template>
