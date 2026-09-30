<template>
  <div class="docs-code">
    <div class="docs-code__toolbar">
      <span>{{ language }}</span>
      <button
        type="button"
        class="docs-code__copy"
        :aria-label="copyLabel"
        :title="copyLabel"
        @click="copyCode"
      >
        <ElIcon><Check v-if="copied" /><CopyDocument v-else /></ElIcon>
      </button>
    </div>
    <pre><code>{{ code }}</code></pre>
  </div>
</template>

<script setup lang="ts">
import { Check, CopyDocument } from '@element-plus/icons-vue'
import { ElIcon } from 'element-plus'
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<{
  code: string
  language?: string
}>(), {
  language: 'text',
})

const copied = ref(false)
const copyFailed = ref(false)
const copyLabel = computed(() =>
  copyFailed.value ? '复制失败' : copied.value ? '已复制' : '复制代码',
)

async function copyCode() {
  try {
    await navigator.clipboard.writeText(props.code)
    copied.value = true
    copyFailed.value = false
  } catch {
    copyFailed.value = true
  }
  window.setTimeout(() => {
    copied.value = false
    copyFailed.value = false
  }, 1800)
}
</script>
