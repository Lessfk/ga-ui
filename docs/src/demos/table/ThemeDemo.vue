<template>
  <GaTable
    :data="rows"
    :columns="columns"
    :theme="tableTheme"
    row-key="id"
    highlight-current-row
  />
</template>

<script setup lang="ts">
import { GaTable, type GaTableColumn, type GaTableTheme } from 'ga-ui-plus/base'

interface UserRow {
  id: number
  name: string
  address: string
}

const rows: UserRow[] = [
  { id: 1, name: '张三', address: '上海市浦东新区世纪大道 100 号' },
  { id: 2, name: '李四', address: '杭州市西湖区文三路 88 号' },
  { id: 3, name: '王五', address: '北京市海淀区中关村大街 66 号' },
]

const columns: GaTableColumn<UserRow>[] = [
  { key: 'name', prop: 'name', label: '姓名', width: 120 },
  { key: 'address', prop: 'address', label: '地址', minWidth: 220 },
]

const tableTheme: GaTableTheme = {
  headerBackgroundColor: '#101828',
  headerTextColor: '#f9fafb',
  stripeBackgroundColor: '#f8fafc',
  hoverBackgroundColor: '#eff8ff',
  currentRowBackgroundColor: '#d1e9ff',
}
</script>
