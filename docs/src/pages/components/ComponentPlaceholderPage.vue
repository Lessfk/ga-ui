<template>
  <article class="doc-page component-page">
    <p class="doc-eyebrow">{{ category }} / {{ title }}</p>
    <h1>{{ title }}</h1>
    <p class="doc-lead">该组件的使用示例与 API 文档正在整理中。</p>
    <div class="component-placeholder">
      <span class="component-placeholder__rule" aria-hidden="true" />
      <h2>文档编写中</h2>
      <p>稍后会在这里提供可运行示例、属性、事件和插槽说明。</p>
    </div>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  category: string
}>()
</script>
