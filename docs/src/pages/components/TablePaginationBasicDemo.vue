<template>
  <div class="table-pagination-demo">
    <GaTablePagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :data="pageRows"
      :columns="columns"
      :total="allRows.length"
      :page-sizes="[5, 10, 20]"
      layout="total, sizes, prev, pager, next"
      row-key="id"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </div>
  <p class="demo-feedback">{{ feedback }}</p>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { GaTableColumn } from 'ga-ui-plus/base'
import { GaTablePagination } from 'ga-ui-plus/business'

interface OrderRow {
  id: number
  customer: string
  project: string
  amount: string
  status: string
}

const customers = ['青禾科技', '远景设计', '星河数据', '云帆工作室']
const projects = ['网站改版', '数据平台', '品牌升级', '移动应用']
const allRows: OrderRow[] = Array.from({ length: 37 }, (_, index) => ({
  id: index + 1,
  customer: customers[index % customers.length]!,
  project: projects[index % projects.length]!,
  amount: `¥${(1280 + index * 135).toLocaleString('zh-CN')}`,
  status: index % 3 === 0 ? '待处理' : '已完成',
}))

const columns: GaTableColumn<OrderRow>[] = [
  { prop: 'id', label: '编号', width: 72 },
  { prop: 'customer', label: '客户', minWidth: 128 },
  { prop: 'project', label: '项目', minWidth: 128 },
  { prop: 'amount', label: '金额', minWidth: 112, align: 'right' },
  { prop: 'status', label: '状态', minWidth: 88, align: 'center' },
]

const currentPage = ref(1)
const pageSize = ref(5)
const feedback = ref('当前展示第 1–5 条，共 37 条')
const pageRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return allRows.slice(start, start + pageSize.value)
})

function handleCurrentChange(page: number) {
  feedback.value = `已切换至第 ${page} 页，当前展示 ${pageRows.value.length} 条`
}

function handleSizeChange(size: number) {
  currentPage.value = 1
  feedback.value = `每页 ${size} 条，已返回第 1 页`
}
</script>

<style scoped>
.table-pagination-demo { height: 360px; min-height: 0; }
.demo-feedback { margin: 14px 0 0; color: #606266; font-size: 13px; }
</style>
