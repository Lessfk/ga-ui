<template>
  <main class="search-bar-demo">
    <section class="search-bar-demo__section">
      <h2>标准搜索栏</h2>
      <GaSearchBar
        v-model="query"
        v-model:collapsed="collapsed"
        :fields="fields"
        :collapsed-count="3"
        label-width="88px"
        @search="handleSearch"
        @reset="handleReset"
      >
        <template #field-departmentId="{ value, update, disabled }">
          <ElTreeSelect
            :model-value="value as string | undefined"
            :data="departmentTree"
            :disabled="disabled"
            clearable
            check-strictly
            placeholder="请选择部门"
            @update:model-value="update"
          />
        </template>
      </GaSearchBar>
    </section>

    <section class="search-bar-demo__section">
      <h2>紧凑搜索栏</h2>
      <GaSearchBar
        v-model="compactQuery"
        :fields="compactFields"
        label-mode="placeholder"
        :show-collapse="false"
        @search="handleCompactSearch"
        @reset="handleCompactReset"
      />
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage, ElTreeSelect } from 'element-plus'
import { GaSearchBar, type GaSearchField, type GaSearchModel } from 'ga-ui-plus/business'

const query = ref<GaSearchModel>({
  keyword: '',
  status: undefined,
  createdAt: [],
  departmentId: undefined,
})
const compactQuery = ref<GaSearchModel>({
  keyword: '',
  status: undefined,
})
const collapsed = ref(true)
const statusOptions = ref<{ label: string; value: string }[]>([])

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
    label: '关键词',
    type: 'input',
    componentProps: { clearable: true },
  },
  {
    key: 'status',
    label: '状态',
    type: 'select',
    options: statusOptions.value,
    componentProps: { clearable: true },
  },
  {
    key: 'createdAt',
    label: '创建日期',
    type: 'daterange',
    format: 'YYYY年MM月DD日',
    valueFormat: 'YYYY-MM-DD',
    componentProps: { unlinkPanels: true },
  },
  {
    key: 'departmentId',
    label: '部门',
    type: 'custom',
  },
])

const compactFields = computed<GaSearchField[]>(() => [
  {
    key: 'keyword',
    label: '关键词',
    type: 'input',
    componentProps: { clearable: true },
  },
  {
    key: 'status',
    label: '状态',
    type: 'select',
    options: statusOptions.value,
    componentProps: { clearable: true },
  },
])

onMounted(async () => {
  await Promise.resolve()
  statusOptions.value = [
    { label: '启用', value: 'enabled' },
    { label: '禁用', value: 'disabled' },
  ]
})

const showPayload = (prefix: string, model: GaSearchModel) => {
  ElMessage.success(`${prefix}: ${JSON.stringify(model)}`)
}

const handleSearch = (model: GaSearchModel) => {
  showPayload('查询', model)
}

const handleReset = (model: GaSearchModel) => {
  showPayload('重置', model)
}

const handleCompactSearch = (model: GaSearchModel) => {
  showPayload('紧凑查询', model)
}

const handleCompactReset = (model: GaSearchModel) => {
  showPayload('紧凑重置', model)
}
</script>

<style scoped>
.search-bar-demo {
  display: grid;
  gap: 24px;
  padding: 24px;
}

.search-bar-demo__section {
  padding: 20px 0;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.search-bar-demo__section h2 {
  margin: 0 0 16px;
  font-size: 18px;
  letter-spacing: 0;
}
</style>
