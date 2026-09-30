<template>
  <div class="style-controls" role="group" aria-label="搜索栏样式">
    <ElRadioGroup v-model="styleName">
      <ElRadioButton value="standard"><span class="style-dot style-dot--blue" />标准</ElRadioButton>
      <ElRadioButton value="compact">紧凑</ElRadioButton>
      <ElRadioButton value="teal"><span class="style-dot style-dot--teal" />青绿</ElRadioButton>
    </ElRadioGroup>
  </div>
  <div class="search-demo">
    <GaSearchBar
      v-model="model"
      :fields="fields"
      :label-mode="styleName === 'compact' ? 'none' : 'label'"
      :label-position="styleName === 'compact' ? 'right' : 'top'"
      :size="styleName === 'compact' ? 'small' : 'default'"
      :gutter="styleName === 'compact' ? 8 : 16"
      :class="{ 'searchbar-teal': styleName === 'teal' }"
      @search="handleSearch"
      @reset="message = '条件已重置'"
    />
    <p class="demo-message" role="status">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import { ElRadioButton, ElRadioGroup } from 'element-plus'
import { ref } from 'vue'
import { GaSearchBar, type GaSearchField, type GaSearchModel } from 'ga-ui-plus/business'

const styleName = ref<'standard' | 'compact' | 'teal'>('standard')
const model = ref<GaSearchModel>({ keyword: '', status: '', owner: '' })
const message = ref('尚未查询')

const fields: GaSearchField[] = [
  {
    key: 'keyword', type: 'input', label: '关键词', placeholder: '输入关键词',
    span: 12, xs: 24, componentProps: { clearable: true },
  },
  {
    key: 'status', type: 'select', label: '状态', placeholder: '全部状态',
    span: 12, xs: 24,
    options: [
      { label: '进行中', value: 'active' },
      { label: '已完成', value: 'done' },
    ],
  },
  { key: 'owner', type: 'input', label: '负责人', placeholder: '输入负责人', span: 12, xs: 24 },
]

function handleSearch(value: GaSearchModel) {
  message.value = `已查询：${String(value.keyword || '全部关键词')}`
}
</script>

<style scoped>
.style-controls { margin-bottom: 20px; }
.search-demo { min-height: 160px; }
.search-demo :deep(.ga-search-bar__actions-col) { flex: 0 0 100%; max-width: 100%; }
.search-demo :deep(.ga-search-bar.searchbar-teal .el-button--primary) {
  --el-button-bg-color: #176e69;
  --el-button-border-color: #176e69;
  --el-button-hover-bg-color: #20847e;
  --el-button-hover-border-color: #20847e;
}
.style-dot {
  display: inline-block;
  width: 9px;
  height: 9px;
  margin-right: 7px;
  border: 1px solid rgb(48 49 51 / 20%);
  border-radius: 50%;
  vertical-align: 1px;
}
.style-dot--blue { background: #409eff; }
.style-dot--teal { background: #176e69; }
.demo-message { margin: 4px 0 0; color: #606266; font-size: 13px; }
</style>
