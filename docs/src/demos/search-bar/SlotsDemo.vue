<template>
  <GaSearchBar v-model="model" :fields="fields" @search="handleSearch">
    <template #action-search="{ search, actionsLoading, actionsDisabled }">
      <ElButton
        type="success"
        native-type="button"
        :loading="actionsLoading"
        :disabled="actionsDisabled || actionsLoading"
        @click="search"
      >
        开始查询
      </ElButton>
    </template>

    <template #actions-append="{ actionsDisabled }">
      <ElButton :disabled="actionsDisabled" @click="handleExport">
        导出
      </ElButton>
    </template>
  </GaSearchBar>
</template>

<script setup lang="ts">
import { ElButton } from 'element-plus'
import { ref } from 'vue'

import {
  GaSearchBar,
  type GaSearchField,
  type GaSearchModel,
} from 'ga-ui-plus/business'

const model = ref<GaSearchModel>({ keyword: '' })

const fields: GaSearchField[] = [
  {
    key: 'keyword',
    type: 'input',
    label: '关键词',
    placeholder: '请输入关键词',
  },
]

function handleSearch(value: GaSearchModel) {
  console.log('search', value)
}

function handleExport() {
  console.log('export')
}
</script>
