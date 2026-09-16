<script setup lang="ts">
import { Moon, RefreshLeft, Sunny } from '@element-plus/icons-vue'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useDocsTheme } from '../composables/useDocsTheme'
import { componentCatalog } from '../content/catalog'
import { buildSearchEntries } from '../content/navigation'
import type { SearchEntry } from '../content/types'

const router = useRouter()
const docsTheme = useDocsTheme()
const searchValue = ref('')
const searchEntries = buildSearchEntries(componentCatalog)
const toggleLabel = computed(() =>
  docsTheme.theme.value === 'light' ? '切换深色模式' : '切换浅色模式',
)

function search(
  query: string,
  callback: (results: SearchEntry[]) => void,
) {
  const normalized = query.trim().toLocaleLowerCase('zh-CN')
  if (!normalized) {
    callback([])
    return
  }

  callback(
    searchEntries.filter((entry) =>
      [entry.label, entry.description, ...entry.keywords].some((value) =>
        value.toLocaleLowerCase('zh-CN').includes(normalized),
      ),
    ),
  )
}

function selectEntry(entry: Record<string, unknown>) {
  if (typeof entry.path !== 'string') return
  searchValue.value = ''
  void router.push(entry.path)
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
        value-key="label"
        :fetch-suggestions="search"
        :debounce="0"
        :trigger-on-focus="false"
        :teleported="false"
        @select="selectEntry"
      >
        <template #default="{ item }">
          <div class="ga-docs-search-result">
            <strong>{{ item.label }}</strong>
            <span>{{ item.description }}</span>
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
