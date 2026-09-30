<template>
  <div class="table-demo-toolbar">
    <span>已选 {{ selectedCount }} 项</span>
    <ElButton :disabled="selectedCount === 0" @click="clearSelection">清空选择</ElButton>
  </div>
  <GaTable
    ref="tableInstance"
    :data="rows"
    :columns="columns"
    row-key="id"
    @selection-change="handleSelectionChange"
  />
</template>

<script setup lang="ts">
import { ElButton } from 'element-plus'
import { ref } from 'vue'
import { GaTable, type GaTableColumn, type GaTableExpose } from 'ga-ui-plus/base'

interface UserRow {
  id: number
  name: string
  department: string
  age: number
}

const rows: UserRow[] = [
  { id: 1, name: '张三', department: '产品设计', age: 28 },
  { id: 2, name: '李四', department: '研发中心', age: 32 },
  { id: 3, name: '王五', department: '客户成功', age: 26 },
  { id: 4, name: '赵六', department: '研发中心', age: 35 },
]

const columns: GaTableColumn<UserRow>[] = [
  { key: 'selection', type: 'selection', width: 48 },
  { prop: 'name', label: '姓名', minWidth: 120 },
  { prop: 'department', label: '部门', minWidth: 160 },
  { prop: 'age', label: '年龄', width: 100, sortable: true },
]

const selectedCount = ref(0)
const tableInstance = ref<GaTableExpose>()

function handleSelectionChange(selection: UserRow[]) {
  selectedCount.value = selection.length
}

function clearSelection() {
  tableInstance.value?.tableRef?.clearSelection()
}
</script>

<style scoped>
.table-demo-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
  color: #606266;
  font-size: 13px;
}
</style>
