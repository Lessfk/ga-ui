<script setup lang="ts">
import { computed, onBeforeUnmount, shallowRef, watch } from 'vue'

import ApiTable from '../components/ApiTable.vue'
import DemoBlock from '../components/DemoBlock.vue'
import SourceCode from '../components/SourceCode.vue'
import { usePageOutline } from '../composables/usePageOutline'
import { loadComponentDoc } from '../content/component-docs'
import type {
  ApiEntry,
  ApiSectionName,
  ComponentDocDefinition,
} from '../content/types'

const props = defineProps<{ slug: string }>()
const outline = usePageOutline()
const definition = shallowRef<ComponentDocDefinition>()
const failedSlug = shallowRef('')
let requestId = 0

interface VisibleApiSection {
  key: ApiSectionName
  title: string
  entries: ApiEntry[]
}

const apiSectionTitles: Record<ApiSectionName, string> = {
  props: 'Props',
  events: 'Events',
  slots: 'Slots',
  expose: 'Expose',
}

function visibleApiSections(doc: ComponentDocDefinition): VisibleApiSection[] {
  return (Object.keys(apiSectionTitles) as ApiSectionName[])
    .filter((key) => doc.api[key].length > 0)
    .map((key) => ({
      key,
      title: apiSectionTitles[key],
      entries: doc.api[key],
    }))
}

const apiSections = computed(() =>
  definition.value ? visibleApiSections(definition.value) : [],
)

function publishOutline(doc: ComponentDocDefinition) {
  outline.setItems([
    { id: 'usage', label: '使用方式', level: 2 },
    ...(doc.demos.length
      ? [{ id: 'examples', label: '示例', level: 2 as const }]
      : []),
    ...visibleApiSections(doc).map((section) => ({
      id: section.key,
      label: section.title,
      level: 2 as const,
    })),
  ])
}

watch(
  () => props.slug,
  async (slug) => {
    const currentRequest = ++requestId
    definition.value = undefined
    failedSlug.value = ''
    outline.setItems([])

    try {
      const loaded = await loadComponentDoc(slug)
      if (currentRequest !== requestId) return
      definition.value = loaded
      publishOutline(loaded)
    } catch {
      if (currentRequest !== requestId) return
      failedSlug.value = slug
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  requestId += 1
  outline.setItems([])
})
</script>

<template>
  <main v-if="definition" class="ga-docs-page ga-docs-component">
    <header class="ga-docs-component__intro">
      <h1>{{ definition.title }}</h1>
      <p>{{ definition.description }}</p>
    </header>

    <section id="usage" class="ga-docs-component__section">
      <h2>使用方式</h2>
      <div class="ga-docs-component__usage">
        <div>
          <h3>导入</h3>
          <SourceCode :code="definition.importCode" language="ts" />
        </div>
        <div>
          <h3>基础用法</h3>
          <SourceCode :code="definition.usage" language="vue" />
        </div>
      </div>
    </section>

    <section
      v-if="definition.demos.length"
      id="examples"
      class="ga-docs-component__section"
    >
      <h2>示例</h2>
      <div class="ga-docs-component__demos">
        <DemoBlock
          v-for="demo in definition.demos"
          :key="demo.id"
          :title="demo.title"
          :description="demo.description"
          :demo="demo.component"
          :source="demo.source"
        />
      </div>
    </section>

    <section
      v-for="section in apiSections"
      :id="section.key"
      :key="section.key"
      class="ga-docs-component__section"
    >
      <h2>{{ section.title }}</h2>
      <ApiTable :section="section.key" :entries="section.entries" />
    </section>

    <aside
      v-if="definition.notes.length"
      class="ga-docs-component__notes"
      aria-labelledby="component-notes-title"
    >
      <h2 id="component-notes-title">使用说明</h2>
      <ul>
        <li v-for="note in definition.notes" :key="note">{{ note }}</li>
      </ul>
    </aside>
  </main>

  <main v-else-if="failedSlug" class="ga-docs-page">
    <ElResult
      icon="warning"
      title="组件文档加载失败"
      :sub-title="`未找到 ${failedSlug} 的组件文档。`"
    >
      <template #extra>
        <RouterLink class="ga-docs-button-link" to="/components/dialog">
          返回组件入口
        </RouterLink>
      </template>
    </ElResult>
  </main>

  <main v-else class="ga-docs-page ga-docs-component__loading">
    <ElSkeleton :rows="8" animated />
  </main>
</template>
