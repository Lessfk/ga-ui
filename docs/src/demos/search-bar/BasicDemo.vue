<template>
  <GaSearchBar
    v-model="model"
    v-model:collapsed="collapsed"
    :fields="fields"
    @search="handleSearch"
    @reset="handleReset"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

import {
  GaSearchBar,
  type GaSearchField,
  type GaSearchModel,
} from 'ga-ui-plus/business'

const collapsed = ref(true)

const model = ref<GaSearchModel>({
  keyword: '',
  status: undefined,
  createdAt: [],
})

const fields: GaSearchField[] = [
  {
    key: 'keyword',
    type: 'input',
    label: '关键词',
    placeholder: '请输入关键词',
  },
  {
    key: 'status',
    type: 'select',
    label: '状态',
    options: [
      { label: '启用', value: 'enabled' },
      { label: '停用', value: 'disabled' },
    ],
  },
  {
    key: 'createdAt',
    type: 'daterange',
    label: '创建日期',
    format: 'YYYY年MM月DD日',
    valueFormat: 'YYYY-MM-DD',
  },
  {
    key: 'owner',
    type: 'input',
    label: '负责人',
  },
]

function handleSearch(value: GaSearchModel) {
  console.log('search', value)
}

function handleReset(value: GaSearchModel) {
  console.log('reset', value)
}
</script>
