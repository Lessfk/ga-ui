<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    code: string
    language?: string
  }>(),
  {
    language: 'vue',
  },
)
const highlighted = ref('')
let requestId = 0

watch(
  () => [props.code, props.language] as const,
  async ([code, language]) => {
    const currentRequest = ++requestId
    highlighted.value = ''
    try {
      const { codeToHtml } = await import('shiki')
      const html = await codeToHtml(code, {
        lang: language,
        themes: { light: 'github-light', dark: 'github-dark' },
      })
      if (currentRequest === requestId) highlighted.value = html
    } catch {
      if (currentRequest === requestId) highlighted.value = ''
    }
  },
  { immediate: true },
)
</script>

<template>
  <div
    v-if="highlighted"
    class="ga-docs-source-code"
    data-testid="source-code"
    v-html="highlighted"
  />
  <pre
    v-else
    class="ga-docs-source-code"
    data-testid="source-code"
  ><code>{{ code }}</code></pre>
</template>
