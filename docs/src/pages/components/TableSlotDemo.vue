<template>
  <GaTable :data="rows" :columns="columns" row-key="id">
    <template #status="{ row }">
      <ElTag :type="row.status === 'enabled' ? 'success' : 'info'">
        {{ row.status === 'enabled' ? '启用' : '停用' }}
      </ElTag>
    </template>
    <template #action="{ row }">
      <ElButton link type="primary" @click="toggleStatus(row)">
        {{ row.status === 'enabled' ? '停用' : '启用' }}
      </ElButton>
    </template>
  </GaTable>
</template>

<script setup lang="ts">
import { ElButton, ElTag } from 'element-plus'
import { ref } from 'vue'
import { GaTable, type GaTableColumn } from 'ga-ui-plus/base'

interface UserRow {
  id: number
  name: string
  department: string
  status: 'enabled' | 'disabled'
}

const rows = ref<UserRow[]>([
  { id: 1, name: '张三', department: '产品设计', status: 'enabled' },
  { id: 2, name: '李四', department: '研发中心', status: 'disabled' },
  { id: 3, name: '王五', department: '客户成功', status: 'enabled' },
])

const columns: GaTableColumn<UserRow>[] = [
  { prop: 'name', label: '姓名', minWidth: 120 },
  { prop: 'department', label: '部门', minWidth: 160 },
  { prop: 'status', label: '状态', width: 100, slot: 'status', align: 'center' },
  { key: 'action', label: '操作', width: 100, slot: 'action', align: 'center' },
]

function toggleStatus(row: UserRow) {
  row.status = row.status === 'enabled' ? 'disabled' : 'enabled'
}
</script>
