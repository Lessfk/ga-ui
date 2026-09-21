<template>
  <section class="table-pagination-theme">
    <GaTablePagination
      :data="rows"
      :columns="columns"
      row-key="id"
      v-model:current-page="currentPage"
      :total="50"
      :table-theme="tableTheme"
      :pagination-theme="paginationTheme"
    />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import type {
  GaPaginationTheme,
  GaTableColumn,
  GaTableTheme,
} from 'ga-ui-plus/base'
import { GaTablePagination } from 'ga-ui-plus/business'

interface UserRow {
  id: number
  name: string
}

const currentPage = ref(1)

const rows: UserRow[] = [
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
]

const columns: GaTableColumn<UserRow>[] = [
  { key: 'name', prop: 'name', label: '姓名', minWidth: 160 },
]

const tableTheme: GaTableTheme = {
  headerBackgroundColor: '#101828',
  headerTextColor: '#f9fafb',
  stripeBackgroundColor: '#f8fafc',
  hoverBackgroundColor: '#eff8ff',
}

const paginationTheme: GaPaginationTheme = {
  backgroundColor: '#ffffff',
  activeColor: '#ffffff',
  activeBackgroundColor: '#155eef',
  hoverColor: '#155eef',
}
</script>

<style scoped>
.table-pagination-theme {
  height: 360px;
  min-height: 0;
}
</style>
