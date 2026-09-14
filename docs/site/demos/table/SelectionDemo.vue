<script setup lang="ts">
import { ref } from 'vue'
import type { GaTableColumn, GaTableTheme } from 'ga-ui-plus/base'

interface ProjectRow {
  id: number
  name: string
  owner: string
  progress: number
}

const selection = ref<ProjectRow[]>([])

const data: ProjectRow[] = [
  { id: 1, name: '管理后台', owner: '张三', progress: 82 },
  { id: 2, name: '数据中心', owner: '李四', progress: 54 },
  { id: 3, name: '消息平台', owner: '王五', progress: 36 },
]

const columns: GaTableColumn<ProjectRow>[] = [
  { key: 'selection', type: 'selection', width: 48 },
  { key: 'name', prop: 'name', label: '项目', minWidth: 150 },
  { key: 'owner', prop: 'owner', label: '负责人', width: 110 },
  { key: 'progress', prop: 'progress', label: '进度', minWidth: 160, slot: 'progress' },
]

const theme: GaTableTheme = {
  headerBackgroundColor: '#183153',
  headerTextColor: '#ffffff',
  stripeBackgroundColor: '#f5f8fb',
  hoverBackgroundColor: '#eaf2fb',
}
</script>

<template>
  <div class="ga-doc-stack">
    <span class="ga-doc-note">已选择 {{ selection.length }} 项</span>
    <GaTable
      :data="data"
      :columns="columns"
      :theme="theme"
      row-key="id"
      @selection-change="selection = $event"
    >
      <template #progress="{ row }">
        <ElProgress :percentage="row.progress" :stroke-width="8" />
      </template>
    </GaTable>
  </div>
</template>
