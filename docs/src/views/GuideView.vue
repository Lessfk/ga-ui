<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from 'vue'

import SourceCode from '../components/SourceCode.vue'
import { usePageOutline } from '../composables/usePageOutline'
import { guides } from '../content/guides'

const props = defineProps<{ slug: string }>()
const outline = usePageOutline()
const guide = computed(() => guides[props.slug])

watch(
  guide,
  (value) => {
    outline.setItems(
      value?.sections.map((section) => ({
        id: section.id,
        label: section.title,
        level: 2,
      })) ?? [],
    )
  },
  { immediate: true },
)

onBeforeUnmount(() => outline.setItems([]))
</script>

<template>
  <main v-if="guide" class="ga-docs-page ga-docs-guide">
    <header class="ga-docs-guide__intro">
      <h1>{{ guide.title }}</h1>
      <p>{{ guide.description }}</p>
    </header>

    <section
      v-for="section in guide.sections"
      :id="section.id"
      :key="section.id"
      class="ga-docs-guide__section"
    >
      <h2>{{ section.title }}</h2>
      <p v-for="paragraph in section.paragraphs" :key="paragraph">
        {{ paragraph }}
      </p>
      <ul v-if="section.bullets?.length">
        <li v-for="bullet in section.bullets" :key="bullet">{{ bullet }}</li>
      </ul>
      <SourceCode
        v-if="section.code"
        :code="section.code"
        :language="section.language"
      />
    </section>
  </main>

  <main v-else class="ga-docs-page">
    <ElResult
      icon="warning"
      title="指南不存在"
      :sub-title="`未找到 ${slug} 的使用指南。`"
    >
      <template #extra>
        <RouterLink class="ga-docs-button-link" to="/guide/introduction">
          返回介绍
        </RouterLink>
      </template>
    </ElResult>
  </main>
</template>
