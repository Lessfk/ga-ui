<template>
  <GaTable :data="rows" :columns="columns" row-key="id">
    <template #column-prepend>
      <ElTableColumn type="selection" width="48" />
    </template>

    <ElTableColumn label="操作" width="100" fixed="right">
      <template #default="{ row }">
        <ElButton link type="primary" @click="viewUser(row)">查看</ElButton>
      </template>
    </ElTableColumn>
  </GaTable>
</template>

<script setup lang="ts">
import { ElButton, ElTableColumn } from 'element-plus'

import { GaTable, type GaTableColumn } from 'ga-ui-plus/base'

interface UserRow {
  id: number
  name: string
  address: string
}

const rows: UserRow[] = [
  { id: 1, name: '张三', address: '上海市浦东新区世纪大道 100 号' },
  { id: 2, name: '李四', address: '杭州市西湖区文三路 88 号' },
]

const columns: GaTableColumn<UserRow>[] = [
  { key: 'name', prop: 'name', label: '姓名', width: 120 },
  { key: 'address', prop: 'address', label: '地址', minWidth: 220, showOverflowTooltip: true },
]

function viewUser(row: unknown) {
  void row
}
</script>
