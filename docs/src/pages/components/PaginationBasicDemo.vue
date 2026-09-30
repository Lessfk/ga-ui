<template>
  <ul class="pagination-records">
    <li v-for="record in visibleRecords" :key="record.id">
      <span>{{ record.title }}</span>
      <span>{{ record.owner }}</span>
    </li>
  </ul>
  <div class="pagination-controls">
    <GaPagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :total="records.length"
      :page-sizes="[5, 10, 20]"
      layout="total, sizes, prev, pager, next"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { GaPagination } from 'ga-ui-plus/base'

const owners = ['张三', '李四', '王五', '赵六']
const records = Array.from({ length: 36 }, (_, index) => ({
  id: index + 1,
  title: `工单 ${String(index + 1).padStart(3, '0')}`,
  owner: owners[index % owners.length],
}))

const currentPage = ref(1)
const pageSize = ref(5)
const visibleRecords = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return records.slice(start, start + pageSize.value)
})
</script>

<style scoped>
.pagination-records {
  height: 188px;
  margin: 0 0 18px;
  padding: 0;
  overflow-y: auto;
  list-style: none;
}

.pagination-records li {
  display: flex;
  min-height: 37px;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  border-bottom: 1px solid #ebeef5;
  color: #303133;
  font-size: 13px;
}

.pagination-records li span:last-child { color: #909399; }

.pagination-controls { overflow-x: auto; }
.pagination-controls :deep(.ga-pagination) { min-width: 600px; }
</style>
