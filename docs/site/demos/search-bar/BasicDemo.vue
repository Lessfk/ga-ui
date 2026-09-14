<script setup lang="ts">
import { ref } from 'vue'
import type { GaSearchField, GaSearchModel } from 'ga-ui-plus/business'

const query = ref<GaSearchModel>({
  keyword: '',
  status: '',
  createdAt: '',
  department: [],
})
const collapsed = ref(true)
const result = ref('尚未查询')

const fields: GaSearchField[] = [
  {
    key: 'keyword',
    type: 'input',
    label: '关键词',
    placeholder: '名称或编号',
    span: 8,
  },
  {
    key: 'status',
    type: 'select',
    label: '状态',
    placeholder: '请选择状态',
    span: 8,
    options: [
      { label: '启用', value: 'enabled' },
      { label: '停用', value: 'disabled' },
    ],
  },
  {
    key: 'createdAt',
    type: 'date',
    label: '创建日期',
    placeholder: '选择日期',
    valueFormat: 'YYYY-MM-DD',
    span: 8,
  },
  {
    key: 'department',
    type: 'select',
    label: '部门',
    placeholder: '可多选',
    span: 8,
    options: [
      { label: '产品部', value: 'product' },
      { label: '研发部', value: 'engineering' },
      { label: '运营部', value: 'operations' },
    ],
    componentProps: {
      multiple: true,
      collapseTags: true,
    },
  },
]

function handleSearch(model: GaSearchModel) {
  result.value = JSON.stringify(model)
}

function handleReset(model: GaSearchModel) {
  result.value = `已重置：${JSON.stringify(model)}`
}
</script>

<template>
  <div class="ga-doc-stack">
    <GaSearchBar
      v-model="query"
      v-model:collapsed="collapsed"
      :fields="fields"
      :collapsed-count="3"
      label-width="84px"
      @search="handleSearch"
      @reset="handleReset"
    />

    <ElAlert :closable="false" title="查询结果" :description="result" />
  </div>
</template>
