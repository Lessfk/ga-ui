<template>
  <section class="table-pagination-demo">
    <GaTablePagination
      :data="rows"
      :columns="columns"
      row-key="id"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :total="100"
      position="left"
      @current-change="loadUsers"
      @size-change="handlePageSizeChange"
    >
      <template #column-prepend>
        <ElTableColumn type="selection" width="48" />
      </template>

      <template #status="{ row }">
        <ElTag :type="row.status === 'enabled' ? 'success' : 'info'">
          {{ row.status === 'enabled' ? '启用' : '停用' }}
        </ElTag>
      </template>

      <ElTableColumn label="操作" width="100" fixed="right">
        <template #default="{ row }">
          <ElButton link type="primary" @click="viewUser(row)">查看</ElButton>
        </template>
      </ElTableColumn>
    </GaTablePagination>
  </section>
</template>

<script setup lang="ts">
import { ElButton, ElTableColumn, ElTag } from 'element-plus'
import { ref } from 'vue'

import type { GaTableColumn } from 'ga-ui-plus/base'
import { GaTablePagination } from 'ga-ui-plus/business'

interface UserRow {
  id: number
  name: string
  address: string
  status: 'enabled' | 'disabled'
}

const currentPage = ref(1)
const pageSize = ref(10)

const rows = ref<UserRow[]>([
  { id: 1, name: '张三', address: '上海市浦东新区世纪大道 100 号', status: 'enabled' },
  { id: 2, name: '李四', address: '杭州市西湖区文三路 88 号', status: 'disabled' },
  { id: 3, name: '王五', address: '北京市海淀区中关村大街 66 号', status: 'enabled' },
])

const columns: GaTableColumn<UserRow>[] = [
  { key: 'name', prop: 'name', label: '姓名', minWidth: 140 },
  { key: 'address', prop: 'address', label: '地址', minWidth: 260, showOverflowTooltip: true },
  { key: 'status', prop: 'status', label: '状态', width: 100, align: 'center', slot: 'status' },
]

function loadUsers(page: number) {
  void page
}

function handlePageSizeChange(size: number) {
  currentPage.value = 1
  loadUsers(1)
  void size
}

function viewUser(row: unknown) {
  void row
}
</script>

<style scoped>
.table-pagination-demo {
  height: 420px;
  min-height: 0;
}
</style>
