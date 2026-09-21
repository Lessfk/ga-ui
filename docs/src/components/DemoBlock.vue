<template>
  <section class="demo-block">
    <div class="demo-block__demo">
      <slot />
    </div>

    <div v-show="expanded" class="demo-block__code">
      <pre><code>{{ source }}</code></pre>
    </div>

    <button
      type="button"
      class="demo-block__toggle"
      @click="expanded = !expanded"
    >
      {{ expanded ? '隐藏代码' : '查看代码' }}
    </button>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  /** demo 组件源码，通过 import source from './Demo.vue?raw' 传入 */
  source: string
}>()

const expanded = ref(false)
</script>

<style scoped lang="scss">
.demo-block {
  margin: 0 0 20px;
  overflow: hidden;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
}

.demo-block__demo {
  padding: 24px;
}

.demo-block__code {
  border-top: 1px solid #e4e7ed;

  pre {
    margin: 0;
    padding: 16px 20px;
    overflow-x: auto;
    color: #303133;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
    font-size: 13px;
    line-height: 1.7;
    background: #f8fafc;
  }
}

.demo-block__toggle {
  display: grid;
  width: 100%;
  height: 40px;
  padding: 0;
  color: #909399;
  font: inherit;
  font-size: 13px;
  place-items: center;
  cursor: pointer;
  background: #fff;
  border: 0;
  border-top: 1px solid #e4e7ed;
  transition:
    color 0.2s ease,
    background 0.2s ease;

  &:hover {
    color: #3451b2;
    background: #f8faff;
  }
}
</style>
