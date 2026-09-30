<template>
  <div class="demo-controls">
    <label>空数据 <ElSwitch v-model="showEmpty" /></label>
    <label>加载中 <ElSwitch v-model="loading" /></label>
  </div>
  <div class="table-pagination-demo">
    <GaTablePagination
      v-model:current-page="currentPage"
      :data="pageRows"
      :columns="columns"
      :total="showEmpty ? 0 : members.length"
      :page-size="5"
      :loading="loading"
      layout="total, prev, pager, next"
      row-key="id"
      position="left"
      loading-text="正在加载成员..."
    >
      <template #status="{ row }">
        <ElTag :type="row.enabled ? 'success' : 'info'" size="small">
          {{ row.enabled ? '启用' : '停用' }}
        </ElTag>
      </template>
      <template #empty>
        <div class="demo-empty">当前没有可显示的成员</div>
      </template>
    </GaTablePagination>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElSwitch, ElTag } from 'element-plus'
import type { GaTableColumn } from 'ga-ui-plus/base'
import { GaTablePagination } from 'ga-ui-plus/business'

interface MemberRow {
  id: number
  name: string
  team: string
  enabled: boolean
}

const members: MemberRow[] = Array.from({ length: 12 }, (_, index) => ({
  id: index + 1,
  name: `成员 ${String(index + 1).padStart(2, '0')}`,
  team: ['产品组', '研发组', '设计组'][index % 3]!,
  enabled: index % 4 !== 0,
}))

const columns: GaTableColumn<MemberRow>[] = [
  { prop: 'id', label: '编号', width: 80 },
  { prop: 'name', label: '姓名', minWidth: 160 },
  { prop: 'team', label: '团队', minWidth: 140 },
  { prop: 'enabled', label: '状态', minWidth: 100, slot: 'status', align: 'center' },
]

const currentPage = ref(1)
const showEmpty = ref(false)
const loading = ref(false)
const pageRows = computed(() =>
  showEmpty.value ? [] : members.slice((currentPage.value - 1) * 5, currentPage.value * 5),
)

watch(showEmpty, () => { currentPage.value = 1 })
</script>

<style scoped>
.demo-controls { display: flex; gap: 24px; margin-bottom: 16px; }
.demo-controls label { display: inline-flex; align-items: center; gap: 8px; color: #606266; font-size: 13px; }
.table-pagination-demo { height: 350px; min-height: 0; }
.demo-empty { padding: 28px 0; color: #909399; text-align: center; }
</style>
