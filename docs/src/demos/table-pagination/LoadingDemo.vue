<script setup lang="ts">
import { ref } from 'vue'
import type {
  GaPaginationTheme,
  GaTableColumn,
  GaTableTheme,
} from 'ga-ui-plus/base'

interface TaskRow {
  id: number
  task: string
  owner: string
}

const loading = ref(false)
const currentPage = ref(1)

const data: TaskRow[] = [
  { id: 1, task: '核对业务数据', owner: '张三' },
  { id: 2, task: '生成经营报表', owner: '李四' },
]

const columns: GaTableColumn<TaskRow>[] = [
  { key: 'task', prop: 'task', label: '任务', minWidth: 180 },
  { key: 'owner', prop: 'owner', label: '负责人', width: 120 },
]

const tableTheme: GaTableTheme = {
  headerBackgroundColor: '#173d35',
  headerTextColor: '#ffffff',
}

const paginationTheme: GaPaginationTheme = {
  backgroundColor: '#f4f7f6',
  activeBackgroundColor: '#087b62',
  hoverBackgroundColor: '#2d8b75',
}

function simulateLoading() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 1200)
}
</script>

<template>
  <div class="ga-doc-stack">
    <div class="ga-doc-actions">
      <ElButton type="primary" :loading="loading" @click="simulateLoading">
        模拟加载
      </ElButton>
      <span class="ga-doc-note">loading 时分页会同步禁用</span>
    </div>

    <div class="table-pagination-loading-demo">
      <GaTablePagination
        v-model:current-page="currentPage"
        :data="data"
        :columns="columns"
        :total="40"
        :loading="loading"
        :table-theme="tableTheme"
        :pagination-theme="paginationTheme"
      />
    </div>
  </div>
</template>

<style scoped>
.table-pagination-loading-demo {
  height: 310px;
}
</style>
