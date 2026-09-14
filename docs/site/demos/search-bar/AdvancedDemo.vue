<script setup lang="ts">
import { ref } from 'vue'
import type { FormRules } from 'element-plus'
import type {
  GaSearchBarExpose,
  GaSearchField,
  GaSearchModel,
} from 'ga-ui-plus/business'

const searchBarRef = ref<GaSearchBarExpose>()
const actionsLoading = ref(false)
const query = ref<GaSearchModel>({
  name: '',
  owner: '',
})

const fields: GaSearchField[] = [
  {
    key: 'name',
    type: 'input',
    label: '项目名称',
    placeholder: '必填',
    span: 12,
  },
  {
    key: 'owner',
    type: 'custom',
    label: '负责人',
    span: 12,
  },
]

const rules: FormRules = {
  name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
}

async function runSearch() {
  actionsLoading.value = true
  await new Promise((resolve) => setTimeout(resolve, 600))
  actionsLoading.value = false
}
</script>

<template>
  <GaSearchBar
    ref="searchBarRef"
    v-model="query"
    :fields="fields"
    :rules="rules"
    :actions-loading="actionsLoading"
    validate-on-search
    :actions-show-reset="false"
    @search="runSearch"
  >
    <template #field-owner="{ value, update }">
      <ElInput
        :model-value="String(value ?? '')"
        placeholder="自定义字段插槽"
        @update:model-value="update"
      />
    </template>

    <template #actions-prepend>
      <ElButton @click="searchBarRef?.clearValidate()">清除校验</ElButton>
    </template>

    <template #action-search="{ search, actionsLoading }">
      <ElButton type="success" :loading="actionsLoading" @click="search">
        自定义查询
      </ElButton>
    </template>

    <template #actions-append>
      <ElButton @click="searchBarRef?.reset()">恢复初始值</ElButton>
    </template>
  </GaSearchBar>
</template>
