<script setup lang="ts">
import { ArrowDown } from '@element-plus/icons-vue'
import { reactive } from 'vue'

import { componentCatalog } from '../content/catalog'
import { buildComponentGroups } from '../content/navigation'
import type { ComponentCategory } from '../content/types'

const groups = buildComponentGroups(componentCatalog)
const collapsed = reactive<Record<ComponentCategory, boolean>>({
  base: false,
  business: false,
})

function toggleGroup(key: ComponentCategory) {
  collapsed[key] = !collapsed[key]
}
</script>

<template>
  <aside class="ga-docs-sidebar" aria-label="组件导航">
    <nav class="ga-docs-sidebar__nav">
      <RouterLink class="ga-docs-sidebar__guide" to="/">
        文档首页
      </RouterLink>

      <section
        v-for="group in groups"
        :key="group.key"
        class="ga-docs-sidebar__group"
      >
        <button
          class="ga-docs-sidebar__group-toggle"
          type="button"
          :aria-expanded="!collapsed[group.key]"
          @click="toggleGroup(group.key)"
        >
          <span>{{ group.label }}</span>
          <ElIcon
            class="ga-docs-sidebar__group-icon"
            :class="{ 'is-collapsed': collapsed[group.key] }"
          >
            <ArrowDown />
          </ElIcon>
        </button>

        <div v-show="!collapsed[group.key]" class="ga-docs-sidebar__links">
          <RouterLink
            v-for="item in group.items"
            :key="item.slug"
            :to="`/components/${item.slug}`"
          >
            <span>{{ item.title }}</span>
            <small>{{ item.name }}</small>
          </RouterLink>
        </div>
      </section>
    </nav>
  </aside>
</template>
