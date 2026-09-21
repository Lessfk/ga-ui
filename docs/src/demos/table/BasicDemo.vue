<template>
  <GaTable
    :data="rows"
    :columns="columns"
    row-key="id"
    @selection-change="handleSelectionChange"
  />
</template>

<script setup lang="ts">
import { GaTable, type GaTableColumn } from 'ga-ui-plus/base'

interface UserRow {
  id: number
  name: string
  address: string
  status: 'enabled' | 'disabled'
}

const rows: UserRow[] = [
  { id: 1, name: '张三', address: '上海市浦东新区世纪大道 100 号', status: 'enabled' },
  { id: 2, name: '李四', address: '杭州市西湖区文三路 88 号', status: 'disabled' },
  { id: 3, name: '王五', address: '北京市海淀区中关村大街 66 号', status: 'enabled' },
]

const columns: GaTableColumn<UserRow>[] = [
  { key: 'selection', type: 'selection', width: 48 },
  { key: 'name', prop: 'name', label: '姓名', width: 120 },
  { key: 'address', prop: 'address', label: '地址', minWidth: 220, showOverflowTooltip: true },
  { key: 'status', prop: 'status', label: '状态', width: 100 },
]

function handleSelectionChange(selection: UserRow[]) {
  void selection
}
</script>
