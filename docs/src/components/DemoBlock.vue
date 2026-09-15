<script setup lang="ts">
import { ArrowDown, ArrowUp, Refresh } from '@element-plus/icons-vue'
import type { Component } from 'vue'
import { computed, markRaw, ref, toRaw } from 'vue'

import CopyButton from './CopyButton.vue'
import SourceCode from './SourceCode.vue'

const props = defineProps<{
  title: string
  description: string
  demo: Component
  source: string
}>()
const sourceOpen = ref(false)
const renderKey = ref(0)
const demoComponent = computed(() => markRaw(toRaw(props.demo)))

function resetDemo() {
  renderKey.value += 1
}
</script>

<template>
  <section class="ga-docs-demo">
    <header class="ga-docs-demo__header">
      <div>
        <h3>{{ title }}</h3>
        <p v-if="description">{{ description }}</p>
      </div>
      <div class="ga-docs-demo__actions">
        <ElTooltip content="恢复案例">
          <ElButton
            text
            circle
            data-action="reset-demo"
            aria-label="恢复案例"
            @click="resetDemo"
          >
            <ElIcon><Refresh /></ElIcon>
          </ElButton>
        </ElTooltip>
        <CopyButton :text="source" />
        <ElTooltip :content="sourceOpen ? '收起代码' : '展开代码'">
          <ElButton
            text
            circle
            data-action="toggle-source"
            :aria-label="sourceOpen ? '收起代码' : '展开代码'"
            @click="sourceOpen = !sourceOpen"
          >
            <ElIcon>
              <component :is="sourceOpen ? ArrowUp : ArrowDown" />
            </ElIcon>
          </ElButton>
        </ElTooltip>
      </div>
    </header>

    <div class="ga-docs-demo__surface">
      <component :is="demoComponent" :key="renderKey" />
    </div>

    <div v-if="sourceOpen" class="ga-docs-demo__source">
      <SourceCode :code="source" language="vue" />
    </div>
  </section>
</template>
