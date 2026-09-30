<template>
  <ElButton type="primary" @click="visible = true">自定义标题与关闭确认</ElButton>

  <GaDialog
    ref="dialogInstance"
    v-model="visible"
    width="600px"
    :before-close="confirmClose"
  >
    <template #header="{ close, titleId, titleClass }">
      <div class="custom-header">
        <div class="custom-header__title">
          <h2 :id="titleId" :class="titleClass">编辑通知</h2>
          <small>使用 header 插槽替换默认标题栏</small>
        </div>
        <ElButton
          link
          :icon="Close"
          aria-label="关闭对话框"
          title="关闭对话框"
          @click="close"
        />
      </div>
    </template>

    <ElForm label-position="top">
      <ElFormItem label="通知内容">
        <ElInput v-model="draft" type="textarea" :rows="3" />
      </ElFormItem>
    </ElForm>

    <template #footer>
      <ElButton @click="requestClose">放弃修改</ElButton>
      <ElButton type="primary" @click="save">保存</ElButton>
    </template>
  </GaDialog>
</template>

<script setup lang="ts">
import { Close } from '@element-plus/icons-vue'
import {
  ElButton,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
  ElMessageBox,
  type DialogBeforeCloseFn,
} from 'element-plus'
import { ref } from 'vue'
import { GaDialog, type GaDialogExpose } from 'ga-ui-plus/base'

const visible = ref(false)
const draft = ref('请在这里编辑通知内容。')
const dialogInstance = ref<GaDialogExpose>()

const confirmClose: DialogBeforeCloseFn = (done) => {
  void ElMessageBox.confirm('确定放弃未保存的修改吗？', '确认关闭', {
    type: 'warning',
    confirmButtonText: '确定放弃',
    cancelButtonText: '继续编辑',
  })
    .then(() => done())
    .catch(() => {})
}

function requestClose() {
  dialogInstance.value?.dialogRef?.handleClose()
}

function save() {
  visible.value = false
  ElMessage.success('示例保存完成')
}
</script>

<style scoped>
.custom-header {
  display: flex;
  width: 100%;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.custom-header__title {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.custom-header__title h2 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.5;
}

.custom-header__title small {
  color: #909399;
  font-size: 12px;
}
</style>
