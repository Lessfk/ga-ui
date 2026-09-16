<script setup lang="ts">
import { Moon, RefreshLeft, Sunny } from '@element-plus/icons-vue'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useDocsTheme } from '../composables/useDocsTheme'
import { createSearchEntries, searchDocs } from '../content/search'
import type { SearchEntry } from '../content/types'

const router = useRouter()
const docsTheme = useDocsTheme()
const searchValue = ref('')
const searchEntries = createSearchEntries()
const toggleLabel = computed(() =>
  docsTheme.theme.value === 'light' ? '切换深色模式' : '切换浅色模式',
)

function search(
  query: string,
  callback: (results: SearchEntry[]) => void,
) {
  callback(searchDocs(query, searchEntries))
}

function selectEntry(entry: Record<string, unknown>) {
  if (typeof entry.path !== 'string') return
  searchValue.value = ''
  void router.push(entry.path)
}

function resultPrimary(entry: SearchEntry) {
  if (!entry.meta || entry.meta === '组件') return entry.label
  return entry.meta.split(' · ')[0] ?? entry.label
}

function resultSecondary(entry: SearchEntry) {
  if (!entry.meta || entry.meta === '组件') return entry.description
  const section = entry.meta.split(' · ')[1]
  return section ? `${section} · ${entry.label}` : entry.description
}
</script>

<template>
  <header class="ga-docs-header">
    <RouterLink class="ga-docs-header__brand" to="/" aria-label="GA UI Plus 首页">
      <span class="ga-docs-header__mark" aria-hidden="true">GA</span>
      <span>GA UI Plus</span>
    </RouterLink>

    <nav class="ga-docs-header__nav" aria-label="主导航">
      <RouterLink to="/guide/introduction">介绍</RouterLink>
      <RouterLink to="/guide/quick-start">快速开始</RouterLink>
      <RouterLink to="/guide/resolver">按需引入</RouterLink>
    </nav>

    <div class="ga-docs-header__tools">
      <ElAutocomplete
        v-model="searchValue"
        class="ga-docs-header__search"
        placeholder="搜索组件或 API"
        aria-label="搜索组件或 API"
        value-key="label"
        :fetch-suggestions="search"
        :debounce="0"
        :trigger-on-focus="false"
        :teleported="false"
        @select="selectEntry"
      >
        <template #default="{ item }">
          <div class="ga-docs-search-result">
            <strong>{{ resultPrimary(item) }}</strong>
            <span>{{ resultSecondary(item) }}</span>
          </div>
        </template>
      </ElAutocomplete>

      <ElTooltip :content="toggleLabel">
        <ElButton
          text
          circle
          :aria-label="toggleLabel"
          @click="docsTheme.toggleTheme"
        >
          <ElIcon>
            <component :is="docsTheme.theme.value === 'light' ? Moon : Sunny" />
          </ElIcon>
        </ElButton>
      </ElTooltip>

      <ElTooltip content="恢复浅色模式">
        <ElButton
          text
          circle
          aria-label="恢复浅色模式"
          @click="docsTheme.setTheme('light')"
        >
          <ElIcon><RefreshLeft /></ElIcon>
        </ElButton>
      </ElTooltip>
    </div>
  </header>
</template>
