<template>
  <GaTable :data="rows" :columns="columns" row-key="id">
    <template #column-prepend>
      <ElTableColumn type="index" label="#" width="54" />
    </template>

    <ElTableColumn label="操作" width="100" fixed="right" align="center">
      <template #default="{ row }">
        <ElButton link type="primary" @click="showUser(row)">查看</ElButton>
      </template>
    </ElTableColumn>
  </GaTable>
</template>

<script setup lang="ts">
import { ElButton, ElMessage, ElTableColumn } from 'element-plus'
import { GaTable, type GaTableColumn } from 'ga-ui-plus/base'

interface UserRow {
  id: number
  name: string
  department: string
  city: string
}

const rows: UserRow[] = [
  { id: 1, name: '张三', department: '产品设计', city: '上海' },
  { id: 2, name: '李四', department: '研发中心', city: '杭州' },
  { id: 3, name: '王五', department: '客户成功', city: '北京' },
]

const columns: GaTableColumn<UserRow>[] = [
  { prop: 'name', label: '姓名', minWidth: 130 },
  { prop: 'department', label: '部门', minWidth: 180 },
  { prop: 'city', label: '城市', minWidth: 120 },
]

function showUser(row: unknown) {
  const user = row as UserRow
  ElMessage.info(`${user.name} · ${user.department}`)
}
</script>
