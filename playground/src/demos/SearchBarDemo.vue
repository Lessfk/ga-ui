<template>
  <main class="search-bar-demo">
    <header class="search-bar-demo__header">
      <h1>GaSearchBar 完整演示</h1>
      <div class="search-bar-demo__status">
        <ElTag :type="statusOptionsLoading ? 'warning' : 'success'" effect="plain">
          {{ statusOptionsLoading ? '选项加载中' : '选项已加载' }}
        </ElTag>
        <ElTag effect="plain">{{ configuredFieldCount }} 个字段</ElTag>
      </div>
    </header>

    <section class="search-bar-demo__section search-bar-demo__controls">
      <div class="search-bar-demo__section-heading">
        <h2>参数控制</h2>
        <ElTag :type="collapsed ? 'info' : 'success'" effect="plain">
          {{ collapsed ? '已折叠' : '已展开' }}
        </ElTag>
      </div>

      <ElForm class="search-bar-demo__control-form" label-position="top">
        <ElRow :gutter="16">
          <ElCol :xs="24" :sm="12" :md="8" :lg="6">
            <ElFormItem label="标签模式">
              <ElRadioGroup v-model="labelMode">
                <ElRadioButton value="label">标签</ElRadioButton>
                <ElRadioButton value="none">无标签</ElRadioButton>
              </ElRadioGroup>
            </ElFormItem>
          </ElCol>

          <ElCol :xs="24" :sm="12" :md="8" :lg="6">
            <ElFormItem label="标签位置">
              <ElRadioGroup v-model="labelPosition">
                <ElRadioButton value="left">左侧</ElRadioButton>
                <ElRadioButton value="right">右侧</ElRadioButton>
                <ElRadioButton value="top">顶部</ElRadioButton>
              </ElRadioGroup>
            </ElFormItem>
          </ElCol>

          <ElCol :xs="24" :sm="12" :md="8" :lg="6">
            <ElFormItem label="组件尺寸">
              <ElRadioGroup v-model="size">
                <ElRadioButton value="large">大</ElRadioButton>
                <ElRadioButton value="default">默认</ElRadioButton>
                <ElRadioButton value="small">小</ElRadioButton>
              </ElRadioGroup>
            </ElFormItem>
          </ElCol>

          <ElCol :xs="12" :sm="8" :md="5" :lg="3">
            <ElFormItem label="标签宽度">
              <ElInputNumber
                v-model="labelWidth"
                :min="0"
                :max="180"
                :step="8"
                controls-position="right"
              />
            </ElFormItem>
          </ElCol>

          <ElCol :xs="12" :sm="8" :md="5" :lg="3">
            <ElFormItem label="栅格间距">
              <ElInputNumber
                v-model="gutter"
                :min="0"
                :max="40"
                :step="4"
                controls-position="right"
              />
            </ElFormItem>
          </ElCol>

          <ElCol :xs="12" :sm="8" :md="5" :lg="3">
            <ElFormItem label="折叠字段数">
              <ElInputNumber
                v-model="collapsedCount"
                :min="1"
                :max="8"
                controls-position="right"
              />
            </ElFormItem>
          </ElCol>

          <ElCol :xs="12" :sm="8" :md="5" :lg="3">
            <ElFormItem label="折叠状态">
              <ElSwitch v-model="collapsed" />
            </ElFormItem>
          </ElCol>
        </ElRow>

        <div class="search-bar-demo__switches">
          <label class="search-bar-demo__switch-item">
            <span>操作区加载</span>
            <ElSwitch v-model="actionsLoading" />
          </label>
          <label class="search-bar-demo__switch-item">
            <span>表单禁用</span>
            <ElSwitch v-model="disabled" />
          </label>
          <label class="search-bar-demo__switch-item">
            <span>操作区禁用</span>
            <ElSwitch v-model="actionsDisabled" />
          </label>
          <label class="search-bar-demo__switch-item">
            <span>搜索前校验</span>
            <ElSwitch v-model="validateOnSearch" />
          </label>
          <label class="search-bar-demo__switch-item">
            <span>搜索按钮</span>
            <ElSwitch v-model="actionsShowSearch" />
          </label>
          <label class="search-bar-demo__switch-item">
            <span>重置按钮</span>
            <ElSwitch v-model="actionsShowReset" />
          </label>
          <label class="search-bar-demo__switch-item">
            <span>折叠按钮</span>
            <ElSwitch v-model="actionsShowCollapse" />
          </label>
        </div>
      </ElForm>
    </section>

    <section class="search-bar-demo__section">
      <div class="search-bar-demo__section-heading">
        <h2>默认操作区</h2>
        <span class="search-bar-demo__section-meta">
          当前有效条件 {{ activeConditionCount }} 项
        </span>
      </div>

      <GaSearchBar
        ref="searchBarRef"
        :model-value="query"
        :fields="fields"
        :label-mode="labelMode"
        :label-position="labelPosition"
        :label-width="labelWidth"
        :size="size"
        :gutter="gutter"
        :collapsed="collapsed"
        :collapsed-count="collapsedCount"
        :disabled="disabled"
        :actions-loading="actionsLoading"
        :actions-disabled="actionsDisabled"
        :rules="rules"
        :validate-on-search="validateOnSearch"
        :actions-show-search="actionsShowSearch"
        :actions-show-reset="actionsShowReset"
        :actions-show-collapse="actionsShowCollapse"
        @update:model-value="handleModelUpdate"
        @update:collapsed="handleCollapsedUpdate"
        @search="handleSearch"
        @reset="handleReset"
        @change="handleChange"
        @invalid="handleInvalid"
      >
        <template #prepend>
          <ElCol :span="24">
            <div class="search-bar-demo__slot-bar">
              <ElTag size="small" effect="plain">prepend</ElTag>
              <span>状态数据源</span>
              <ElTag
                size="small"
                :type="statusOptionsLoading ? 'warning' : 'success'"
              >
                {{ statusOptionsLoading ? '加载中' : `${statusOptions.length} 项` }}
              </ElTag>
            </div>
          </ElCol>
        </template>

        <template #field-departmentId="{ value, update, disabled: fieldDisabled }">
          <ElTreeSelect
            :model-value="value as string | undefined"
            :data="departmentTree"
            :disabled="fieldDisabled"
            clearable
            check-strictly
            default-expand-all
            placeholder="请选择部门"
            @update:model-value="update"
          />
        </template>

        <template
          #action-search="{
            search,
            actionsLoading: loading,
            actionsDisabled: actionDisabled,
          }"
        >
          <ElButton
            type="primary"
            native-type="button"
            :icon="Search"
            :loading="loading"
            :disabled="actionDisabled || loading"
            @click="search"
          >
            自定义查询
          </ElButton>
        </template>

        <template #actions-append="{ actionsDisabled: actionDisabled }">
          <ElButton
            native-type="button"
            :icon="Download"
            :disabled="actionDisabled"
            @click="handleExport"
          >
            导出
          </ElButton>
        </template>

        <!-- <template #append>
          <ElCol :span="24">
            <div class="search-bar-demo__slot-bar search-bar-demo__slot-bar--append">
              <ElTag size="small" effect="plain">append</ElTag>
              <span>模型键数量 {{ Object.keys(query).length }}</span>
            </div>
          </ElCol>
        </template> -->
      </GaSearchBar>

      <div class="search-bar-demo__method-bar">
        <div class="search-bar-demo__method-meta">
          <strong>外部实例方法</strong>
          <ElTag size="small" :type="formReady ? 'success' : 'info'" effect="plain">
            formRef {{ formReady ? '可用' : '未就绪' }}
          </ElTag>
        </div>
        <div class="search-bar-demo__method-actions">
          <ElButton :icon="Search" type="primary" @click="invokeSearch">
            search()
          </ElButton>
          <ElButton :icon="RefreshLeft" @click="invokeReset">reset()</ElButton>
          <ElButton :icon="CircleCheck" @click="invokeValidate">
            validate()
          </ElButton>
          <ElButton :icon="Brush" @click="invokeClearValidate">
            clearValidate()
          </ElButton>
          <ElButton :icon="Fold" @click="invokeToggle">toggle()</ElButton>
          <ElButton :icon="View" @click="inspectFormRef">formRef</ElButton>
        </div>
      </div>
    </section>

    <section class="search-bar-demo__section">
      <div class="search-bar-demo__section-heading">
        <h2>自定义 actions 插槽</h2>
        <span class="search-bar-demo__section-meta">默认操作按钮已关闭</span>
      </div>

      <GaSearchBar
        v-model="customQuery"
        v-model:collapsed="customCollapsed"
        :fields="customFields"
        :collapsed-count="2"
        label-mode="none"
        :actions-loading="true"
        :actions-disabled="true"
        :actions-show-search="false"
        :actions-show-reset="false"
        :actions-show-collapse="false"
        @search="handleCustomSearch"
        @reset="handleCustomReset"
        @change="handleCustomChange"
      >
        <template
          #actions="{
            search,
            reset,
            validate,
            clearValidate,
            collapsed: actionCollapsed,
            toggle,
            actionsLoading: actionLoading,
            actionsDisabled: actionDisabled,
          }"
        >
          <div class="search-bar-demo__custom-actions">
            <ElButton
              type="primary"
              :icon="Search"
              :loading="actionLoading"
              :disabled="actionDisabled"
              @click="runBooleanAction('actions.search', search)"
            >
              查询
            </ElButton>
            <ElButton
              :icon="RefreshLeft"
              :disabled="actionDisabled"
              @click="runVoidAction('actions.reset', reset)"
            >
              重置
            </ElButton>
            <ElButton
              :icon="CircleCheck"
              :disabled="actionDisabled"
              @click="runBooleanAction('actions.validate', validate)"
            >
              校验
            </ElButton>
            <ElButton
              :icon="Brush"
              :disabled="actionDisabled"
              @click="runVoidAction('actions.clearValidate', clearValidate)"
            >
              清除校验
            </ElButton>
            <ElButton
              :icon="Fold"
              :disabled="actionDisabled"
              @click="runVoidAction('actions.toggle', toggle)"
            >
              {{ actionCollapsed ? '展开' : '收起' }}
            </ElButton>
          </div>
        </template>
      </GaSearchBar>
    </section>

    <section class="search-bar-demo__section search-bar-demo__events">
      <div class="search-bar-demo__section-heading">
        <h2>事件日志</h2>
        <ElButton
          text
          :icon="Delete"
          :disabled="eventRecords.length === 0"
          @click="clearEventLog"
        >
          清空
        </ElButton>
      </div>

      <ElEmpty
        v-if="eventRecords.length === 0"
        :image-size="56"
        description="暂无事件"
      />
      <ElScrollbar v-else max-height="280px">
        <div class="search-bar-demo__event-list">
          <article
            v-for="record in eventRecords"
            :key="record.id"
            class="search-bar-demo__event-item"
          >
            <time>{{ record.time }}</time>
            <ElTag size="small" effect="plain">{{ record.name }}</ElTag>
            <pre>{{ record.payload }}</pre>
          </article>
        </div>
      </ElScrollbar>
    </section>
  </main>
</template>

<script setup lang="ts">
import {
  Brush,
  CircleCheck,
  Delete,
  Download,
  Fold,
  RefreshLeft,
  Search,
  View,
} from '@element-plus/icons-vue'
import {
  ElButton,
  ElCol,
  ElEmpty,
  ElForm,
  ElFormItem,
  ElInputNumber,
  ElRadioButton,
  ElRadioGroup,
  ElRow,
  ElScrollbar,
  ElSwitch,
  ElTag,
  ElTreeSelect,
} from 'element-plus'
import type { FormRules } from 'element-plus'
import { computed, nextTick, onMounted, ref } from 'vue'

import {
  GaSearchBar,
  type GaSearchBarExpose,
  type GaSearchChangePayload,
  type GaSearchField,
  type GaSearchLabelMode,
  type GaSearchLabelPosition,
  type GaSearchModel,
  type GaSearchOption,
  type GaSearchSize,
} from 'ga-ui-plus/business'

interface EventRecord {
  id: number
  time: string
  name: string
  payload: string
}

type BooleanAction = () => Promise<boolean>
type VoidAction = () => void

const searchBarRef = ref<GaSearchBarExpose>()
const query = ref<GaSearchModel>({
  keyword: '',
  status: undefined,
  businessDate: undefined,
  appointmentAt: undefined,
  createdRange: [],
  activeRange: [],
  note: '',
  departmentId: undefined,
  quickKey: '',
  lockedCondition: '系统预设条件',
  internalTrace: 'trace-demo-001',
})
const customQuery = ref<GaSearchModel>({
  quickKeyword: '',
  quickStatus: undefined,
  quickDate: undefined,
  owner: '',
})

const labelMode = ref<GaSearchLabelMode>('label')
const labelPosition = ref<GaSearchLabelPosition>('right')
const size = ref<GaSearchSize>('default')
const labelWidth = ref(96)
const gutter = ref(16)
const collapsed = ref(true)
const customCollapsed = ref(true)
const collapsedCount = ref(4)
const disabled = ref(false)
const actionsLoading = ref(false)
const actionsDisabled = ref(false)
const validateOnSearch = ref(true)
const actionsShowSearch = ref(true)
const actionsShowReset = ref(true)
const actionsShowCollapse = ref(true)
const statusOptionsLoading = ref(true)
const statusOptions = ref<GaSearchOption[]>([])
const eventRecords = ref<EventRecord[]>([])
let eventId = 0

const rules: FormRules = {
  keyword: [
    { required: true, message: '请输入关键词', trigger: 'blur' },
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' },
  ],
}

const departmentTree = [
  {
    label: '产品中心',
    value: 'product',
    children: [
      { label: '设计部', value: 'design' },
      { label: '研发部', value: 'development' },
    ],
  },
  {
    label: '运营中心',
    value: 'operation',
    children: [
      { label: '市场部', value: 'marketing' },
      { label: '客户成功部', value: 'customer' },
    ],
  },
]

const fields = computed<GaSearchField[]>(() => [
  {
    key: 'keyword',
    type: 'input',
    label: '',
    labelWidth:"0px",
    labelMode:"none",
    placeholder: '请输入名称、编号或联系人',
    defaultValue: 'GA',
    span: 24,
    componentProps: { clearable: true, maxlength: 40 },
  },
  {
    key: 'status',
    type: 'select',
    label: '状态',
    placeholder: statusOptionsLoading.value ? '选项加载中' : '请选择状态',
    options: statusOptions.value,
    defaultValue: 'enabled',
    span: 12,
    componentProps: { clearable: true, filterable: true },
  },
  {
    key: 'businessDate',
    type: 'date',
    label: '交易方证件号码',
    format: 'YYYY年MM月DD日',
    valueFormat: 'YYYY-MM-DD',
    placeholder:"123123123",
    span: 12,
    componentProps: { clearable: true },
  },
  {
    key: 'appointmentAt',
    type: 'datetime',
    label: '预约时间',
    format: 'YYYY-MM-DD HH:mm',
    valueFormat: 'YYYY-MM-DD HH:mm:ss',
    span: 5,
    componentProps: { clearable: true },
  },
  {
    key: 'createdRange',
    type: 'daterange',
    label: '创建日期',
    format: 'YYYY年MM月DD日',
    valueFormat: 'YYYY-MM-DD',
    span: 12,
    componentProps: {
      clearable: true,
      unlinkPanels: true,
      rangeSeparator: '至',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期',
    },
  },
  {
    key: 'activeRange',
    type: 'datetimerange',
    label: '生效区间',
    format: 'YYYY-MM-DD HH:mm',
    valueFormat: 'YYYY-MM-DD HH:mm:ss',
    span: 12,
    componentProps: {
      clearable: true,
      rangeSeparator: '至',
      startPlaceholder: '开始时间',
      endPlaceholder: '结束时间',
    },
  },
  {
    key: 'note',
    type: 'textarea',
    label: '备注',
    placeholder: '请输入备注',
    defaultValue: '默认备注',
    span: 12,
    componentProps: {
      rows: 2,
      maxlength: 120,
      showWordLimit: true,
      clearable: true,
    },
  },
  {
    key: 'departmentId',
    type: 'custom',
    label: '部门',
    span: 6,
  },
  {
    key: 'quickKey',
    type: 'input',
    label: '快捷条件',
    labelMode: 'none',
    placeholder: '无可见标签字段',
    ariaLabel: '快捷条件',
    span: 6,
    componentProps: { clearable: true },
  },
  {
    key: 'lockedCondition',
    type: 'input',
    label: '锁定条件',
    disabled: true,
    span: 6,
  },
  {
    key: 'internalTrace',
    type: 'input',
    label: '内部追踪号',
    hidden: true,
  },
])

const customFields = computed<GaSearchField[]>(() => [
  {
    key: 'quickKeyword',
    type: 'input',
    label: '快捷关键词',
    placeholder: '请输入快捷关键词',
    componentProps: { clearable: true },
  },
  {
    key: 'quickStatus',
    type: 'select',
    label: '快捷状态',
    placeholder: '请选择快捷状态',
    options: statusOptions.value,
    componentProps: { clearable: true },
  },
  {
    key: 'quickDate',
    type: 'date',
    label: '快捷日期',
    placeholder: '请选择快捷日期',
    format: 'YYYY-MM-DD',
    valueFormat: 'YYYY-MM-DD',
  },
  {
    key: 'owner',
    type: 'input',
    label: '负责人',
    placeholder: '请输入负责人',
    componentProps: { clearable: true },
  },
])

const configuredFieldCount = computed(() => fields.value.length)
const activeConditionCount = computed(() =>
  Object.values(query.value).filter(hasConditionValue).length,
)
const formReady = computed(() => Boolean(searchBarRef.value?.formRef))

onMounted(async () => {
  await new Promise<void>((resolve) => {
    window.setTimeout(resolve, 350)
  })
  statusOptions.value = [
    { label: '启用', value: 'enabled' },
    { label: '停用', value: 'disabled' },
    { label: '归档', value: 'archived', disabled: true },
  ]
  statusOptionsLoading.value = false
  await nextTick()
  recordEvent('mounted', { formRef: Boolean(searchBarRef.value?.formRef) })
})

function hasConditionValue(value: unknown) {
  if (Array.isArray(value)) return value.length > 0
  return value !== undefined && value !== null && value !== ''
}

function formatPayload(payload: unknown) {
  if (payload === undefined) return 'undefined'
  try {
    return JSON.stringify(payload, null, 2)
  } catch {
    return String(payload)
  }
}

function recordEvent(name: string, payload: unknown) {
  eventRecords.value.unshift({
    id: ++eventId,
    time: new Intl.DateTimeFormat('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(new Date()),
    name,
    payload: formatPayload(payload),
  })
  eventRecords.value = eventRecords.value.slice(0, 12)
}

function handleModelUpdate(model: GaSearchModel) {
  query.value = model
  recordEvent('update:modelValue', model)
}

function handleCollapsedUpdate(value: boolean) {
  collapsed.value = value
  recordEvent('update:collapsed', value)
}

function handleSearch(model: GaSearchModel) {
  recordEvent('search', model)
}

function handleExport() {
  recordEvent('export', { ...query.value })
}

function handleReset(model: GaSearchModel) {
  recordEvent('reset', model)
}

function handleChange(payload: GaSearchChangePayload) {
  recordEvent('change', payload)
}

function handleInvalid(fields: unknown) {
  recordEvent('invalid', fields)
}

function handleCustomSearch(model: GaSearchModel) {
  recordEvent('custom.search', model)
}

function handleCustomReset(model: GaSearchModel) {
  recordEvent('custom.reset', model)
}

function handleCustomChange(payload: GaSearchChangePayload) {
  recordEvent('custom.change', payload)
}

async function invokeSearch() {
  const result = await searchBarRef.value?.search()
  recordEvent('method.search', { result })
}

function invokeReset() {
  searchBarRef.value?.reset()
  recordEvent('method.reset', query.value)
}

async function invokeValidate() {
  const result = await searchBarRef.value?.validate()
  recordEvent('method.validate', { result })
}

function invokeClearValidate() {
  searchBarRef.value?.clearValidate()
  recordEvent('method.clearValidate', true)
}

function invokeToggle() {
  searchBarRef.value?.toggle()
  recordEvent('method.toggle', { collapsed: collapsed.value })
}

function inspectFormRef() {
  recordEvent('formRef', {
    available: Boolean(searchBarRef.value?.formRef),
  })
}

async function runBooleanAction(name: string, action: BooleanAction) {
  const result = await action()
  recordEvent(name, { result })
}

function runVoidAction(name: string, action: VoidAction) {
  action()
  recordEvent(name, true)
}

function clearEventLog() {
  eventRecords.value = []
}
</script>

<style scoped>
.search-bar-demo {
  min-height: 100%;
  color: var(--el-text-color-primary);
  background: var(--el-bg-color);
}

.search-bar-demo__header,
.search-bar-demo__section {
  padding: 24px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.search-bar-demo__header,
.search-bar-demo__section-heading,
.search-bar-demo__method-bar,
.search-bar-demo__method-meta,
.search-bar-demo__status,
.search-bar-demo__slot-bar,
.search-bar-demo__custom-actions {
  display: flex;
  align-items: center;
}

.search-bar-demo__header,
.search-bar-demo__section-heading,
.search-bar-demo__method-bar {
  justify-content: space-between;
  gap: 16px;
}

.search-bar-demo__header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 650;
  letter-spacing: 0;
}

.search-bar-demo__status,
.search-bar-demo__method-meta,
.search-bar-demo__slot-bar,
.search-bar-demo__custom-actions {
  gap: 8px;
}

.search-bar-demo__section-heading {
  min-height: 32px;
  margin-bottom: 16px;
}

.search-bar-demo__section-heading h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0;
}

.search-bar-demo__section-meta {
  color: var(--el-text-color-secondary);
  font-size: 13px;
}

.search-bar-demo__controls {
  background: var(--el-fill-color-extra-light);
}

.search-bar-demo__control-form {
  padding: 16px 16px 4px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 6px;
  background: var(--el-bg-color);
}

.search-bar-demo__control-form :deep(.el-input-number),
.search-bar-demo__control-form :deep(.el-radio-group) {
  width: 100%;
}

.search-bar-demo__control-form :deep(.el-radio-button) {
  flex: 1;
}

.search-bar-demo__control-form :deep(.el-radio-button__inner) {
  width: 100%;
}

.search-bar-demo__switches {
  display: grid;
  grid-template-columns: repeat(6, minmax(116px, 1fr));
  gap: 8px;
  margin-bottom: 12px;
}

.search-bar-demo__switch-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 42px;
  padding: 0 12px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 4px;
  color: var(--el-text-color-regular);
  background: var(--el-fill-color-blank);
}

.search-bar-demo__slot-bar {
  min-height: 36px;
  margin-bottom: 16px;
  padding: 0 10px;
  border-left: 3px solid var(--el-color-primary);
  color: var(--el-text-color-secondary);
  background: var(--el-fill-color-light);
  font-size: 13px;
}

.search-bar-demo__slot-bar--append {
  margin-top: 4px;
  border-left-color: var(--el-color-success);
}

.search-bar-demo__method-bar {
  flex-wrap: wrap;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px dashed var(--el-border-color);
}

.search-bar-demo__method-meta {
  flex-wrap: wrap;
}

.search-bar-demo__method-actions,
.search-bar-demo__custom-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.search-bar-demo__method-actions :deep(.el-button + .el-button),
.search-bar-demo__custom-actions :deep(.el-button + .el-button) {
  margin-left: 0;
}

.search-bar-demo__custom-actions {
  justify-content: flex-end;
  width: 100%;
}

.search-bar-demo__events {
  min-height: 280px;
}

.search-bar-demo__event-list {
  border-top: 1px solid var(--el-border-color-lighter);
}

.search-bar-demo__event-item {
  display: grid;
  grid-template-columns: 76px 150px minmax(0, 1fr);
  gap: 12px;
  align-items: start;
  padding: 12px 4px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.search-bar-demo__event-item time {
  padding-top: 3px;
  color: var(--el-text-color-secondary);
  font-variant-numeric: tabular-nums;
  font-size: 12px;
}

.search-bar-demo__event-item pre {
  min-width: 0;
  margin: 0;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
  color: var(--el-text-color-regular);
  font-family: Consolas, 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.55;
}

@media (max-width: 1100px) {
  .search-bar-demo__switches {
    grid-template-columns: repeat(3, minmax(116px, 1fr));
  }
}

@media (max-width: 720px) {
  .search-bar-demo__header,
  .search-bar-demo__section {
    padding: 16px;
  }

  .search-bar-demo__header,
  .search-bar-demo__section-heading,
  .search-bar-demo__method-bar {
    align-items: flex-start;
    flex-direction: column;
  }

  .search-bar-demo__switches {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .search-bar-demo__method-actions,
  .search-bar-demo__method-actions :deep(.el-button) {
    width: 100%;
  }

  .search-bar-demo__event-item {
    grid-template-columns: 72px minmax(0, 1fr);
  }

  .search-bar-demo__event-item pre {
    grid-column: 1 / -1;
  }
}
</style>
