<template>
  <section class="dialog-area">
    <h2>GaDialog 通用弹窗示例</h2>

    <ElButton type="primary" @click="dialogVisible = true">
      打开通用弹窗
    </ElButton>

    <GaDialog
      ref="dialogInstance"
      v-model="dialogVisible"
      v-model:fullscreen="dialogFullscreen"
      width="520px"
      destroy-on-close
      modal-class="ga-dialog-demo-modal"
      :before-close="handleDialogBeforeClose"
      title="通用弹窗示例"
    >
      <!-- <template #header="{ close, titleId, titleClass }">
        <div class="dialog-header">
          <span
            :id="titleId"
            :class="titleClass"
          >
            通用弹窗标题
          </span>
          <ElButton
            link
            @click="close"
          >
            关闭
          </ElButton>
        </div>
      </template> -->

      <p>
        GaDialog 默认在关闭按钮左侧提供全屏/还原按钮，并通过
        v-model:fullscreen 同步状态。组件不内置 footer
        业务按钮，底部操作仍由使用方提供。
      </p>

      <p>
        modal-class 会通过 $attrs 透传给 Element Plus
        Dialog，本示例用它标记遮罩层。
      </p>

      <template #footer>
        <ElButton link @click="handleDialogCancel"> 关闭 </ElButton>
        <ElButton @click="handleDialogCancel"> 取消 </ElButton>
        <ElButton type="primary" @click="handleDialogConfirm"> 确认 </ElButton>
      </template>
    </GaDialog>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";

import { type DialogBeforeCloseFn, ElButton } from "element-plus";

import { GaDialog, type GaDialogExpose } from "ga-ui-plus/base";

const dialogVisible = ref(false);
const dialogFullscreen = ref(false);
const dialogInstance = ref<GaDialogExpose>();

const handleDialogBeforeClose: DialogBeforeCloseFn = (done) => {
  if (window.confirm("确定关闭通用弹窗吗？")) done();
};

function handleDialogCancel() {
  dialogInstance.value?.dialogRef?.handleClose();
}

function handleDialogConfirm() {
  dialogVisible.value = false;
}
</script>

<style scoped lang="scss">
.dialog-area {
  flex: none;
  padding-block: 16px;
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

h2 {
  flex: none;
  font-size: 24px;
}
</style>
