<template>
  <div class="search-demo">
    <GaSearchBar v-model="model" :fields="fields" label-position="top" @search="handleSearch">
      <template #field-urgent="{ value, disabled, update }">
        <ElSwitch
          :model-value="Boolean(value)"
          :disabled="disabled"
          aria-label="仅看紧急"
          @update:model-value="update"
        />
      </template>

      <template #action-search="{ search, actionsLoading, actionsDisabled }">
        <ElButton
          type="primary"
          :loading="actionsLoading"
          :disabled="actionsDisabled || actionsLoading"
          @click="search()"
        >
          <ElIcon><Search /></ElIcon><span>筛选</span>
        </ElButton>
      </template>

      <template #actions-append="{ actionsDisabled }">
        <ElButton :disabled="actionsDisabled" @click="saveFilters">
          <ElIcon><Check /></ElIcon><span>保存条件</span>
        </ElButton>
      </template>
    </GaSearchBar>
    <p class="demo-message" role="status">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import { Check, Search } from '@element-plus/icons-vue'
import { ElButton, ElIcon, ElSwitch } from 'element-plus'
import { ref } from 'vue'
import { GaSearchBar, type GaSearchField, type GaSearchModel } from 'ga-ui-plus/business'

const model = ref<GaSearchModel>({ keyword: '', urgent: false })
const message = ref('尚未筛选')
const fields: GaSearchField[] = [
  { key: 'keyword', type: 'input', label: '任务名称', placeholder: '输入关键词', span: 12, xs: 24 },
  { key: 'urgent', type: 'custom', label: '仅看紧急', span: 12, xs: 24 },
]

function handleSearch(value: GaSearchModel) {
  message.value = `已筛选：${String(value.keyword || '全部任务')}，${value.urgent ? '仅紧急' : '全部优先级'}`
}

function saveFilters() {
  message.value = `已保存条件：${JSON.stringify(model.value)}`
}
</script>

<style scoped>
.search-demo { min-height: 130px; }
.search-demo :deep(.ga-search-bar__actions-col) { flex: 0 0 100%; max-width: 100%; }
.search-demo :deep(.ga-search-bar__actions .el-button) { display: inline-flex; gap: 5px; }
.demo-message { margin: 4px 0 0; color: #606266; font-size: 13px; overflow-wrap: anywhere; }
</style>
