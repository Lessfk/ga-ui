<template>
  <section class="table-pagination-demo">
    <header class="demo-toolbar">
      <div class="demo-toolbar__title">
        <h2>GaTablePagination 完整 API</h2>
        <span>第 {{ currentPage }} / {{ totalPages }} 页</span>
      </div>

      <div class="demo-toolbar__actions">
        <ElButton :icon="Refresh" @click="resetDemo">恢复默认</ElButton>
        <ElButton :icon="Delete" @click="showEmpty = !showEmpty">
          {{ showEmpty ? '恢复数据' : '清空数据' }}
        </ElButton>
      </div>
    </header>

    <div class="demo-controls">
      <div class="control-group control-group--switches">
        <span class="control-group__title">表格状态</span>

        <label class="switch-control">
          <span>边框</span>
          <ElSwitch v-model="border" />
        </label>
        <label class="switch-control">
          <span>斑马纹</span>
          <ElSwitch v-model="stripe" />
        </label>
        <label class="switch-control">
          <span>列宽适配</span>
          <ElSwitch v-model="fit" />
        </label>
        <label class="switch-control">
          <span>表头</span>
          <ElSwitch v-model="showHeader" />
        </label>
        <label class="switch-control">
          <span>当前行高亮</span>
          <ElSwitch v-model="highlightCurrentRow" />
        </label>
        <label class="switch-control">
          <span>分页背景</span>
          <ElSwitch v-model="background" />
        </label>
        <label class="switch-control">
          <span>加载状态</span>
          <ElSwitch v-model="loading" />
        </label>
      </div>

      <div class="control-group">
        <span class="control-group__title">组件尺寸</span>
        <ElSegmented v-model="size" :options="sizeOptions" />
      </div>

      <div class="control-group">
        <span class="control-group__title">分页位置</span>
        <ElSegmented v-model="position" :options="positionOptions" />
      </div>

      <div class="control-group control-group--fields">
        <label class="field-control">
          <span>分页布局</span>
          <ElSelect v-model="layout" size="small">
            <ElOption
              v-for="option in layoutOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </ElSelect>
        </label>

        <label class="field-control field-control--number">
          <span>总条数</span>
          <ElInputNumber v-model="total" :min="0" :max="500" size="small" />
        </label>

        <label class="field-control">
          <span>空数据文案</span>
          <ElInput v-model="emptyText" size="small" />
        </label>

        <label class="field-control">
          <span>加载文案</span>
          <ElInput v-model="loadingText" size="small" />
        </label>
      </div>
    </div>

    <div class="demo-stage">
      <GaTablePagination
        id="complete-table-pagination-demo"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        class="api-table-pagination"
        aria-label="GaTablePagination 完整 API 示例"
        :data="displayRows"
        :columns="columns"
        :row-key="getRowKey"
        :border="border"
        :stripe="stripe"
        :size="size"
        :fit="fit"
        :show-header="showHeader"
        :highlight-current-row="highlightCurrentRow"
        :empty-text="emptyText"
        :loading="loading"
        :loading-text="loadingText"
        :total="total"
        :page-sizes="pageSizes"
        :layout="layout"
        :background="background"
        :position="position"
        :table-theme="tableTheme"
        :pagination-theme="paginationTheme"
        @update:current-page="handleCurrentPageUpdate"
        @update:page-size="handlePageSizeUpdate"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      >
        <template #column-prepend>
          <ElTableColumn type="selection" width="48" />
          <ElTableColumn type="index" label="#" width="58" />
        </template>

        <template #status="{ row }">
          <ElTag :type="statusType(row.status)" effect="light">
            {{ statusLabel(row.status) }}
          </ElTag>
        </template>

        <template #empty>
          <ElEmpty :description="emptyText" :image-size="76">
            <ElButton type="primary" :icon="Refresh" @click="showEmpty = false">
              恢复数据
            </ElButton>
          </ElEmpty>
        </template>

        <template #append>
          <div class="table-append">
            当前页 {{ displayRows.length }} 条，分页大小 {{ pageSize }} 条
          </div>
        </template>

        <ElTableColumn label="操作" width="96" fixed="right">
          <template #default="{ row }">
            <ElButton link type="primary" @click="viewUser(row)">
              查看
            </ElButton>
          </template>
        </ElTableColumn>
      </GaTablePagination>
    </div>

    <footer class="demo-footer">
      <div class="state-summary">
        <strong>当前状态</strong>
        <span>currentPage: {{ currentPage }}</span>
        <span>pageSize: {{ pageSize }}</span>
        <span>total: {{ total }}</span>
        <span>size: {{ size }}</span>
        <span>position: {{ position }}</span>
        <span>loading: {{ loading }}</span>
      </div>

      <div class="event-log">
        <div class="event-log__header">
          <strong>事件日志</strong>
          <ElButton link :disabled="eventLogs.length === 0" @click="eventLogs = []">
            清空
          </ElButton>
        </div>

        <div class="event-log__items">
          <span v-if="eventLogs.length === 0" class="event-log__empty">
            暂无分页事件
          </span>
          <code v-for="event in eventLogs" :key="event.id">
            {{ event.name }}: {{ event.value }}
          </code>
        </div>
      </div>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { Delete, Refresh } from '@element-plus/icons-vue'
import {
  ElButton,
  ElEmpty,
  ElInput,
  ElInputNumber,
  ElOption,
  ElSegmented,
  ElSelect,
  ElSwitch,
  ElTableColumn,
  ElTag,
} from 'element-plus'
import type { ComponentSize, TagProps } from 'element-plus'
import { computed, ref } from 'vue'

import type {
  GaPaginationTheme,
  GaTableColumn,
  GaTableRow,
  GaTableTheme,
} from 'ga-ui-plus/base'
import { GaTablePagination } from 'ga-ui-plus/business'

interface UserRow {
  id: number
  name: string
  department: string
  address: string
  status: 'enabled' | 'disabled' | 'pending'
  createdAt: string
}

interface DemoEvent {
  id: number
  name: string
  value: number
}

type PaginationPosition = 'left' | 'center' | 'right'

const defaultLayout = 'total, sizes, prev, pager, next, jumper'
const pageSizes = [5, 10, 20, 50]
const allRows = createRows(57)

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(allRows.length)
const border = ref(true)
const stripe = ref(true)
const fit = ref(true)
const showHeader = ref(true)
const highlightCurrentRow = ref(true)
const background = ref(true)
const loading = ref(false)
const showEmpty = ref(false)
const size = ref<ComponentSize>('default')
const position = ref<PaginationPosition>('right')
const layout = ref(defaultLayout)
const emptyText = ref('暂无用户数据')
const loadingText = ref('正在加载用户数据...')
const eventLogs = ref<DemoEvent[]>([])

let eventId = 0

const sizeOptions = [
  { label: '大', value: 'large' },
  { label: '默认', value: 'default' },
  { label: '小', value: 'small' },
]

const positionOptions = [
  { label: '左', value: 'left' },
  { label: '中', value: 'center' },
  { label: '右', value: 'right' },
]

const layoutOptions = [
  { label: '完整布局', value: defaultLayout },
  { label: '精简布局', value: 'prev, pager, next' },
  { label: '无跳转器', value: 'total, sizes, prev, pager, next' },
]

const columns: GaTableColumn<UserRow>[] = [
  {
    key: 'name',
    prop: 'name',
    label: '姓名',
    minWidth: 120,
  },
  {
    key: 'department',
    prop: 'department',
    label: '部门',
    minWidth: 130,
  },
  {
    key: 'address',
    prop: 'address',
    label: '地址',
    minWidth: 260,
    showOverflowTooltip: true,
  },
  {
    key: 'status',
    prop: 'status',
    label: '状态',
    width: 100,
    align: 'center',
    slot: 'status',
  },
  {
    key: 'createdAt',
    prop: 'createdAt',
    label: '创建时间',
    width: 150,
  },
]

const tableTheme: GaTableTheme = {
  backgroundColor: '#ffffff',
  rowBackgroundColor: '#ffffff',
  textColor: '#344054',
  headerBackgroundColor: '#355a8a',
  headerTextColor: '#ffffff',
  borderColor: '#d4dbe5',
  stripeBackgroundColor: '#f7f9fc',
  hoverBackgroundColor: '#edf4fc',
  currentRowBackgroundColor: '#dceafb',
  expandedRowBackgroundColor: '#f3f6fa',
}

const paginationTheme: GaPaginationTheme = {
  backgroundColor: '#f3f5f8',
  textColor: '#596579',
  buttonColor: '#45546b',
  buttonBackgroundColor: '#ffffff',
  activeColor: '#ffffff',
  activeBackgroundColor: '#356da8',
  hoverColor: '#ffffff',
  hoverBackgroundColor: '#5b88b8',
  disabledColor: '#a3abb7',
  disabledBackgroundColor: '#eef1f5',
}

const displayRows = computed(() => {
  if (showEmpty.value) return []

  const start = Math.max(currentPage.value - 1, 0) * pageSize.value
  return allRows.slice(start, start + pageSize.value)
})

const totalPages = computed(() =>
  Math.max(Math.ceil(total.value / pageSize.value), 1),
)

// GaTablePagination 当前没有通过 defineExpose 暴露实例方法。
// height、maxHeight、theme 和 disabled 也不属于它的公开 Props：
// 组件自行管理表格高度，loading 会同步禁用分页，主题拆分为 tableTheme 和 paginationTheme。

function createRows(count: number): UserRow[] {
  const departments = ['产品中心', '技术中心', '运营中心', '客户服务部']
  const cities = ['上海市浦东新区', '杭州市西湖区', '深圳市南山区', '北京市朝阳区']
  const statuses: UserRow['status'][] = ['enabled', 'disabled', 'pending']

  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `用户 ${String(index + 1).padStart(2, '0')}`,
    department: departments[index % departments.length],
    address: `${cities[index % cities.length]}示例路 ${100 + index} 号`,
    status: statuses[index % statuses.length],
    createdAt: `2026-08-${String((index % 25) + 1).padStart(2, '0')}`,
  }))
}

function getRowKey(row: UserRow) {
  return String(row.id)
}

function statusLabel(status: UserRow['status']) {
  return {
    enabled: '启用',
    disabled: '停用',
    pending: '待审核',
  }[status]
}

function statusType(status: UserRow['status']): TagProps['type'] {
  return {
    enabled: 'success',
    disabled: 'info',
    pending: 'warning',
  }[status] as TagProps['type']
}

function addEvent(name: string, value: number) {
  eventLogs.value = [
    { id: ++eventId, name, value },
    ...eventLogs.value,
  ].slice(0, 8)
}

function handleCurrentPageUpdate(value: number) {
  addEvent('update:current-page', value)
}

function handlePageSizeUpdate(value: number) {
  addEvent('update:page-size', value)
}

function handleCurrentChange(value: number) {
  addEvent('current-change', value)
}

function handleSizeChange(value: number) {
  addEvent('size-change', value)
}

function viewUser(row: GaTableRow) {
  addEvent('view-user', row.id)
}

function resetDemo() {
  currentPage.value = 1
  pageSize.value = 10
  total.value = allRows.length
  border.value = true
  stripe.value = true
  fit.value = true
  showHeader.value = true
  highlightCurrentRow.value = true
  background.value = true
  loading.value = false
  showEmpty.value = false
  size.value = 'default'
  position.value = 'right'
  layout.value = defaultLayout
  emptyText.value = '暂无用户数据'
  loadingText.value = '正在加载用户数据...'
  eventLogs.value = []
}
</script>

<style scoped lang="scss">
.table-pagination-demo {
  display: grid;
  grid-template-rows: auto auto minmax(520px, 1fr) auto;
  min-height: 860px;
  color: #243044;
  background: #eef2f6;
}

.demo-toolbar,
.demo-controls,
.demo-footer {
  padding-right: 24px;
  padding-left: 24px;
  background: #ffffff;
}

.demo-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 64px;
  border-bottom: 1px solid #dce2ea;
}

.demo-toolbar__title {
  display: flex;
  align-items: baseline;
  gap: 14px;
}

.demo-toolbar h2 {
  margin: 0;
  font-size: 18px;
  line-height: 26px;
  letter-spacing: 0;
}

.demo-toolbar__title span {
  color: #748095;
  font-size: 12px;
}

.demo-toolbar__actions {
  display: flex;
  gap: 8px;
}

.demo-controls {
  display: grid;
  grid-template-columns: minmax(520px, 1.5fr) auto auto minmax(460px, 1fr);
  gap: 22px;
  align-items: start;
  padding-top: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #dce2ea;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 9px;
  min-width: 0;
}

.control-group__title {
  color: #69758a;
  font-size: 12px;
  font-weight: 700;
}

.control-group--switches {
  display: grid;
  grid-template-columns: repeat(4, minmax(100px, 1fr));
}

.control-group--switches .control-group__title {
  grid-column: 1 / -1;
}

.switch-control,
.field-control {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  color: #4c586c;
  font-size: 12px;
}

.switch-control {
  justify-content: space-between;
}

.control-group--fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(180px, 1fr));
}

.control-group--fields .control-group__title {
  grid-column: 1 / -1;
}

.field-control span {
  flex: 0 0 auto;
}

.field-control :deep(.el-select),
.field-control :deep(.el-input) {
  min-width: 0;
  flex: 1;
}

.field-control--number :deep(.el-input-number) {
  width: 132px;
}

.demo-stage {
  min-width: 0;
  min-height: 0;
  padding: 18px 24px;
}

.api-table-pagination {
  height: 100%;
  overflow: hidden;
  border: 1px solid #d4dbe5;
  background: #ffffff;
}

.table-append {
  padding: 10px 14px;
  color: #69758a;
  font-size: 12px;
  background: #f7f9fc;
  border-top: 1px solid #e1e6ed;
}

.demo-footer {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(440px, 1.2fr);
  gap: 24px;
  min-height: 112px;
  padding-top: 14px;
  padding-bottom: 18px;
  border-top: 1px solid #dce2ea;
}

.state-summary,
.event-log {
  min-width: 0;
}

.state-summary {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 8px 18px;
  color: #5c687b;
  font-family: Consolas, monospace;
  font-size: 12px;
}

.state-summary strong {
  width: 100%;
  color: #2f3a4c;
  font-family: inherit;
}

.event-log__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 28px;
}

.event-log__items {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.event-log code {
  padding: 4px 7px;
  color: #315d8b;
  font-size: 11px;
  background: #edf4fb;
  border: 1px solid #d3e2f2;
  border-radius: 4px;
}

.event-log__empty {
  color: #98a2b3;
  font-size: 12px;
}

@media (max-width: 1500px) {
  .demo-controls {
    grid-template-columns: minmax(520px, 1.4fr) auto auto;
  }

  .control-group--fields {
    grid-column: 1 / -1;
    grid-template-columns: repeat(4, minmax(190px, 1fr));
  }
}
</style>
