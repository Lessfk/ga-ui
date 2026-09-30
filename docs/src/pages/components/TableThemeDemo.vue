<template>
  <div class="table-theme-options" role="group" aria-label="表格风格">
    <ElRadioGroup v-model="activeTheme">
      <ElRadioButton label="default"><span class="theme-dot theme-dot--blue" />默认蓝</ElRadioButton>
      <ElRadioButton label="mint"><span class="theme-dot theme-dot--mint" />薄荷绿</ElRadioButton>
      <ElRadioButton label="graphite"><span class="theme-dot theme-dot--graphite" />石墨灰</ElRadioButton>
    </ElRadioGroup>
  </div>
  <GaTable
    :data="rows"
    :columns="columns"
    :theme="themes[activeTheme]"
    row-key="id"
    highlight-current-row
  />
</template>

<script setup lang="ts">
import { ElRadioButton, ElRadioGroup } from 'element-plus'
import { ref } from 'vue'
import { GaTable, type GaTableColumn, type GaTableTheme } from 'ga-ui-plus/base'

interface UserRow {
  id: number
  name: string
  department: string
  status: string
}

const rows: UserRow[] = [
  { id: 1, name: '张三', department: '产品设计', status: '进行中' },
  { id: 2, name: '李四', department: '研发中心', status: '已完成' },
  { id: 3, name: '王五', department: '客户成功', status: '待处理' },
]

const columns: GaTableColumn<UserRow>[] = [
  { prop: 'name', label: '姓名', minWidth: 120 },
  { prop: 'department', label: '部门', minWidth: 160 },
  { prop: 'status', label: '状态', minWidth: 120 },
]

const themes: Record<'default' | 'mint' | 'graphite', GaTableTheme | undefined> = {
  default: undefined,
  mint: {
    headerBackgroundColor: '#1f6d62',
    headerTextColor: '#ffffff',
    stripeBackgroundColor: '#eef8f4',
    hoverBackgroundColor: '#e6f4ef',
    currentRowBackgroundColor: '#d4eee5',
    borderColor: '#b6d5cc',
  },
  graphite: {
    headerBackgroundColor: '#374151',
    headerTextColor: '#f9fafb',
    stripeBackgroundColor: '#f3f4f6',
    hoverBackgroundColor: '#e5e7eb',
    currentRowBackgroundColor: '#dbeafe',
    borderColor: '#cbd5e1',
  },
}

const activeTheme = ref<keyof typeof themes>('default')
</script>

<style scoped>
.table-theme-options {
  margin-bottom: 14px;
}

.theme-dot {
  display: inline-block;
  width: 9px;
  height: 9px;
  margin-right: 7px;
  border-radius: 50%;
  vertical-align: 1px;
}

.theme-dot--blue { background: #4f7db2; }
.theme-dot--mint { background: #1f6d62; }
.theme-dot--graphite { background: #374151; }
</style>
