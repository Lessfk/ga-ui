<template>
  <div class="theme-controls" role="group" aria-label="表格分页主题">
    <ElRadioGroup v-model="themeName">
      <ElRadioButton value="default"><span class="theme-dot theme-dot--blue" />默认蓝</ElRadioButton>
      <ElRadioButton value="teal"><span class="theme-dot theme-dot--teal" />青绿</ElRadioButton>
      <ElRadioButton value="graphite"><span class="theme-dot theme-dot--graphite" />石墨</ElRadioButton>
    </ElRadioGroup>
  </div>
  <div class="table-pagination-demo">
    <GaTablePagination
      v-model:current-page="currentPage"
      :data="pageRows"
      :columns="columns"
      :total="rows.length"
      :page-size="5"
      :table-theme="themes[themeName].table"
      :pagination-theme="themes[themeName].pagination"
      layout="total, prev, pager, next"
      row-key="id"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElRadioButton, ElRadioGroup } from 'element-plus'
import type { GaPaginationTheme, GaTableColumn, GaTableTheme } from 'ga-ui-plus/base'
import { GaTablePagination } from 'ga-ui-plus/business'

interface TaskRow {
  id: number
  task: string
  owner: string
  progress: string
}

const rows: TaskRow[] = Array.from({ length: 15 }, (_, index) => ({
  id: index + 1,
  task: ['需求整理', '交互设计', '开发联调'][index % 3]!,
  owner: ['林青', '陈一', '周宁'][index % 3]!,
  progress: `${40 + (index % 6) * 10}%`,
}))

const columns: GaTableColumn<TaskRow>[] = [
  { prop: 'id', label: '序号', width: 80 },
  { prop: 'task', label: '任务', minWidth: 170 },
  { prop: 'owner', label: '负责人', minWidth: 130 },
  { prop: 'progress', label: '进度', minWidth: 100, align: 'right' },
]

const themes: Record<string, { table?: GaTableTheme; pagination?: GaPaginationTheme }> = {
  default: {},
  teal: {
    table: {
      headerBackgroundColor: '#176e69',
      stripeBackgroundColor: '#f2faf7',
      hoverBackgroundColor: '#e7f5ef',
      borderColor: '#c8e2da',
    },
    pagination: {
      backgroundColor: '#e7f5ef',
      activeBackgroundColor: '#176e69',
      hoverBackgroundColor: '#bfe7da',
      hoverColor: '#145b56',
    },
  },
  graphite: {
    table: {
      headerBackgroundColor: '#303846',
      stripeBackgroundColor: '#f4f6f9',
      hoverBackgroundColor: '#e9eef6',
      borderColor: '#d7dde6',
    },
    pagination: {
      backgroundColor: '#e9eef6',
      activeBackgroundColor: '#303846',
      hoverBackgroundColor: '#cfd9e8',
      hoverColor: '#303846',
    },
  },
}

const themeName = ref<'default' | 'teal' | 'graphite'>('default')
const currentPage = ref(1)
const pageRows = computed(() => rows.slice((currentPage.value - 1) * 5, currentPage.value * 5))
</script>

<style scoped>
.theme-controls { margin-bottom: 16px; }
.table-pagination-demo { height: 350px; min-height: 0; }
.theme-dot {
  display: inline-block;
  width: 9px;
  height: 9px;
  margin-right: 7px;
  border: 1px solid rgb(48 49 51 / 20%);
  border-radius: 50%;
  vertical-align: 1px;
}
.theme-dot--blue { background: #4f7db2; }
.theme-dot--teal { background: #176e69; }
.theme-dot--graphite { background: #303846; }
</style>
