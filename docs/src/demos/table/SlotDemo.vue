<template>
  <GaTable :data="rows" :columns="columns" row-key="id">
    <template #status="{ row }">
      <ElTag :type="row.status === 'enabled' ? 'success' : 'info'">
        {{ row.status === 'enabled' ? '启用' : '停用' }}
      </ElTag>
    </template>
  </GaTable>
</template>

<script setup lang="ts">
import { ElTag } from 'element-plus'

import { GaTable, type GaTableColumn } from 'ga-ui-plus/base'

interface UserRow {
  id: number
  name: string
  status: 'enabled' | 'disabled'
}

const rows: UserRow[] = [
  { id: 1, name: '张三', status: 'enabled' },
  { id: 2, name: '李四', status: 'disabled' },
]

const columns: GaTableColumn<UserRow>[] = [
  { key: 'name', prop: 'name', label: '姓名', minWidth: 160 },
  { key: 'status', prop: 'status', label: '状态', width: 120, align: 'center', slot: 'status' },
]
</script>
