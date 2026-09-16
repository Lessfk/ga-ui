<script setup lang="ts">
import { computed } from 'vue'

import type { ApiEntry, ApiSectionName } from '../content/types'
import CopyButton from './CopyButton.vue'

const props = defineProps<{
  section: ApiSectionName
  entries: readonly ApiEntry[]
}>()

const valueColumnLabel = computed(() =>
  props.section === 'props' ? '默认值' : '参数',
)
const sectionLabel = computed(
  () =>
    ({
      props: 'Props',
      events: 'Events',
      slots: 'Slots',
      expose: 'Expose',
    })[props.section],
)

function valueFor(entry: ApiEntry) {
  const value = props.section === 'props' ? entry.default : entry.parameters
  return value?.trim() || '—'
}
</script>

<template>
  <div
    class="ga-docs-api-table__scroll"
    role="region"
    tabindex="0"
    :aria-label="`${sectionLabel} API 表格`"
  >
    <table class="ga-docs-api-table">
      <caption class="ga-docs-sr-only">
        {{ section }} API
      </caption>
      <thead>
        <tr>
          <th scope="col">名称</th>
          <th scope="col">说明</th>
          <th scope="col">类型</th>
          <th scope="col">{{ valueColumnLabel }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="entry in entries" :key="entry.name">
          <td>
            <span class="ga-docs-api-table__name">{{ entry.name }}</span>
            <span v-if="entry.required" class="ga-docs-api-table__required">
              必填
            </span>
          </td>
          <td>{{ entry.description?.trim() || '—' }}</td>
          <td>
            <div class="ga-docs-api-table__type">
              <code>{{ entry.type }}</code>
              <CopyButton
                :text="entry.type"
                action="copy-api-type"
                :aria-label="`复制 ${entry.name} 类型`"
              />
            </div>
          </td>
          <td>{{ valueFor(entry) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
