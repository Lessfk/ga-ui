<script setup lang="ts">
import { computed, ref } from 'vue'
import type { GaTableColumn } from 'ga-ui-plus/base'

interface OrderRow {
  id: number
  number: string
  customer: string
  amount: number
  status: 'paid' | 'pending'
}

const currentPage = ref(1)
const pageSize = ref(5)

const allRows: OrderRow[] = Array.from({ length: 18 }, (_, index) => ({
  id: index + 1,
  number: `GA-${String(index + 1).padStart(4, '0')}`,
  customer: `客户 ${index + 1}`,
  amount: 1200 + index * 86,
  status: index % 3 === 0 ? 'pending' : 'paid',
}))

const data = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return allRows.slice(start, start + pageSize.value)
})

const columns: GaTableColumn<OrderRow>[] = [
  { key: 'number', prop: 'number', label: '订单号', minWidth: 130 },
  { key: 'customer', prop: 'customer', label: '客户', minWidth: 120 },
  { key: 'amount', prop: 'amount', label: '金额', width: 110, slot: 'amount' },
  { key: 'status', prop: 'status', label: '状态', width: 100, slot: 'status' },
]
</script>

<template>
  <div class="table-pagination-demo">
    <GaTablePagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :data="data"
      :columns="columns"
      :total="allRows.length"
      :page-sizes="[5, 10]"
      row-key="id"
    >
      <template #amount="{ row }">¥ {{ row.amount.toFixed(2) }}</template>
      <template #status="{ row }">
        <ElTag :type="row.status === 'paid' ? 'success' : 'warning'">
          {{ row.status === 'paid' ? '已支付' : '待支付' }}
        </ElTag>
      </template>
    </GaTablePagination>
  </div>
</template>

<style scoped>
.table-pagination-demo {
  height: 400px;
}
</style>
