<template>
  <div class="search-demo">
    <GaSearchBar
      v-model="model"
      :fields="fields"
      label-position="top"
      :rules="rules"
      :validate-on-search="true"
      @search="handleSearch"
      @invalid="message = '请先填写客户名称'"
      @reset="message = '已重置条件，状态恢复为待处理'"
    />
    <p class="demo-message" role="status">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import type { FormRules } from 'element-plus'
import { ref } from 'vue'
import { GaSearchBar, type GaSearchField, type GaSearchModel } from 'ga-ui-plus/business'

const model = ref<GaSearchModel>({ customer: '', status: '', period: [] })
const message = ref('尚未查询')

const fields: GaSearchField[] = [
  { key: 'customer', type: 'input', label: '客户名称', placeholder: '必填', span: 12, xs: 24 },
  {
    key: 'status', type: 'select', label: '状态', placeholder: '全部状态',
    defaultValue: 'open', span: 12, xs: 24,
    options: [
      { label: '待处理', value: 'open' },
      { label: '已完成', value: 'done' },
    ],
  },
  {
    key: 'period', type: 'daterange', label: '下单日期', placeholder: '选择日期',
    valueFormat: 'YYYY-MM-DD', span: 24, xs: 24,
  },
]

const rules: FormRules = {
  customer: [{ required: true, message: '请输入客户名称', trigger: 'blur' }],
}

function handleSearch(value: GaSearchModel) {
  message.value = `已查询：${String(value.customer ?? '')}`
}
</script>

<style scoped>
.search-demo { min-height: 176px; }
.search-demo :deep(.ga-search-bar__actions-col) { flex: 0 0 100%; max-width: 100%; }
.demo-message { margin: 4px 0 0; color: #606266; font-size: 13px; }
</style>
