<script setup lang="ts">
import type { GaTableColumn } from 'ga-ui-plus/base'

interface UserRow {
  id: number
  name: string
  department: string
  status: 'enabled' | 'disabled'
}

const data: UserRow[] = [
  { id: 1, name: '张三', department: '产品部', status: 'enabled' },
  { id: 2, name: '李四', department: '研发部', status: 'enabled' },
  { id: 3, name: '王五', department: '运营部', status: 'disabled' },
]

const columns: GaTableColumn<UserRow>[] = [
  { key: 'index', type: 'index', label: '序号', width: 70 },
  { key: 'name', prop: 'name', label: '姓名', minWidth: 140 },
  { key: 'department', prop: 'department', label: '部门', minWidth: 140 },
  { key: 'status', prop: 'status', label: '状态', width: 120, slot: 'status' },
]
</script>

<template>
  <GaTable :data="data" :columns="columns" row-key="id">
    <template #status="{ row }">
      <ElTag :type="row.status === 'enabled' ? 'success' : 'info'">
        {{ row.status === 'enabled' ? '启用' : '停用' }}
      </ElTag>
    </template>
  </GaTable>
</template>
