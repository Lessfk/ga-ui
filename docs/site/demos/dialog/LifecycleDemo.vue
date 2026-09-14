<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
const events = ref<string[]>([])

function record(name: string) {
  events.value = [name, ...events.value].slice(0, 6)
}

function beforeClose(done: () => void) {
  record('before-close')
  done()
}
</script>

<template>
  <div class="ga-doc-stack">
    <div class="ga-doc-actions">
      <ElButton type="primary" @click="visible = true">打开并观察事件</ElButton>
      <ElButton @click="events = []">清空记录</ElButton>
    </div>

    <ElAlert
      :closable="false"
      title="最近触发的事件"
      :description="events.join(' -> ') || '暂无事件'"
      type="info"
    />
  </div>

  <GaDialog
    v-model="visible"
    title="生命周期示例"
    width="480px"
    :before-close="beforeClose"
    @open="record('open')"
    @opened="record('opened')"
    @close="record('close')"
    @closed="record('closed')"
    @open-auto-focus="record('open-auto-focus')"
    @close-auto-focus="record('close-auto-focus')"
  >
    点击标题栏关闭按钮时，组件会先执行 `beforeClose`，调用 `done()` 后继续关闭。
  </GaDialog>
</template>
