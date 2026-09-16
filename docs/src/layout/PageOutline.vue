<script setup lang="ts">
import { usePageOutline } from '../composables/usePageOutline'

const outline = usePageOutline()
</script>

<template>
  <aside class="ga-docs-outline" aria-label="本页目录">
    <h2>本页内容</h2>
    <nav>
      <a
        v-for="item in outline.items.value"
        :key="item.id"
        :class="{ 'is-level-three': item.level === 3 }"
        :href="`#${item.id}`"
      >
        {{ item.label }}
      </a>
    </nav>
  </aside>
</template>
