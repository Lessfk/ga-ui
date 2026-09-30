<template>
  <ElButton type="primary" @click="visible = true">打开对话框</ElButton>

  <GaDialog v-model="visible" title="编辑用户" width="520px">
    <ElForm label-position="top">
      <ElFormItem label="用户名称">
        <ElInput v-model="name" placeholder="请输入用户名称" />
      </ElFormItem>
    </ElForm>

    <template #footer>
      <ElButton @click="visible = false">取消</ElButton>
      <ElButton type="primary" @click="save">保存</ElButton>
    </template>
  </GaDialog>
</template>

<script setup lang="ts">
import { ElButton, ElForm, ElFormItem, ElInput, ElMessage } from 'element-plus'
import { ref } from 'vue'
import { GaDialog } from 'ga-ui-plus/base'

const visible = ref(false)
const name = ref('张三')

function save() {
  if (!name.value.trim()) {
    ElMessage.warning('请输入用户名称')
    return
  }
  visible.value = false
  ElMessage.success('示例保存完成')
}
</script>
