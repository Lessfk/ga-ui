<script setup lang="ts">
import { Check, CopyDocument, WarningFilled } from '@element-plus/icons-vue'
import { computed, onBeforeUnmount, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    text: string
    action?: string
    ariaLabel?: string
  }>(),
  {
    action: 'copy-source',
    ariaLabel: '复制代码',
  },
)
const emit = defineEmits<{ copied: [] }>()
const state = ref<'idle' | 'copied' | 'failed'>('idle')
let resetTimer: ReturnType<typeof setTimeout> | undefined
let copyRequest = 0
let unmounted = false

const label = computed(
  () =>
    ({
      idle: props.ariaLabel,
      copied: '已复制',
      failed: '复制失败',
    })[state.value],
)
const icon = computed(
  () =>
    ({
      idle: CopyDocument,
      copied: Check,
      failed: WarningFilled,
    })[state.value],
)

async function copy() {
  const request = ++copyRequest
  if (resetTimer) clearTimeout(resetTimer)
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable')
    await navigator.clipboard.writeText(props.text)
    if (unmounted || request !== copyRequest) return
    state.value = 'copied'
    emit('copied')
  } catch {
    if (unmounted || request !== copyRequest) return
    state.value = 'failed'
  }
  if (unmounted || request !== copyRequest) return
  resetTimer = setTimeout(() => {
    state.value = 'idle'
  }, 1500)
}

onBeforeUnmount(() => {
  unmounted = true
  copyRequest += 1
  if (resetTimer) clearTimeout(resetTimer)
})
</script>

<template>
  <ElTooltip :content="label">
    <ElButton
      text
      circle
      :data-action="props.action"
      :aria-label="label"
      @click="copy"
    >
      <ElIcon><component :is="icon" /></ElIcon>
    </ElButton>
  </ElTooltip>
  <span
    class="ga-docs-sr-only"
    role="status"
    aria-live="polite"
    aria-atomic="true"
  >{{ state === 'idle' ? '' : label }}</span>
</template>
