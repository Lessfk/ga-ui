<template>
  <div class="search-demo">
    <GaSearchBar
      v-model="model"
      v-model:collapsed="collapsed"
      :fields="fields"
      :collapsed-count="2"
      label-position="top"
      @search="handleSearch"
      @reset="handleReset"
    />
    <div class="demo-result">
      <strong>{{ resultLabel }}</strong>
      <code>{{ result }}</code>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { GaSearchBar, type GaSearchField, type GaSearchModel } from 'ga-ui-plus/business'

const model = ref<GaSearchModel>({
  keyword: '',
  status: '',
  createdAt: [],
  owner: '',
})
const collapsed = ref(true)
const resultLabel = ref('当前条件')
const lastPayload = ref<GaSearchModel | null>(null)
const result = computed(() => JSON.stringify(lastPayload.value ?? model.value))

const fields: GaSearchField[] = [
  {
    key: 'keyword', type: 'input', label: '关键词', placeholder: '名称或编号',
    span: 12, xs: 24, componentProps: { clearable: true },
  },
  {
    key: 'status', type: 'select', label: '状态', placeholder: '全部状态',
    span: 12, xs: 24, componentProps: { clearable: true },
    options: [
      { label: '进行中', value: 'active' },
      { label: '已完成', value: 'done' },
    ],
  },
  {
    key: 'createdAt', type: 'daterange', label: '创建日期',
    placeholder: '选择日期', format: 'YYYY/MM/DD', valueFormat: 'YYYY-MM-DD',
    span: 24, xs: 24,
  },
  {
    key: 'owner', type: 'input', label: '负责人', placeholder: '输入负责人',
    span: 12, xs: 24,
  },
]

function handleSearch(value: GaSearchModel) {
  resultLabel.value = '最近查询'
  lastPayload.value = value
}

function handleReset(value: GaSearchModel) {
  resultLabel.value = '重置结果'
  lastPayload.value = value
}
</script>

<style scoped>
.search-demo { min-height: 176px; }
.search-demo :deep(.ga-search-bar__actions-col) { flex: 0 0 100%; max-width: 100%; }
.demo-result { display: flex; gap: 10px; align-items: baseline; margin-top: 4px; color: #606266; font-size: 12px; }
.demo-result strong { flex: 0 0 auto; font-weight: 600; }
.demo-result code { overflow-wrap: anywhere; }
</style>
