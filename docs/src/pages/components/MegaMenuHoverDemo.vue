<template>
  <div class="mega-demo-nav">
    <GaMegaMenu
      v-model:open-key="openKey"
      :menus="menus"
      trigger="hover"
      :open-delay="120"
      :close-delay="240"
      :max-height="320"
      @select="handleSelect"
    />
  </div>
  <p class="mega-demo-result">最近选择：{{ selectedLabel }}</p>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  GaMegaMenu,
  type GaMegaMenuKey,
  type GaMegaMenuNavItem,
  type GaMegaMenuSelectPayload,
} from 'ga-ui-plus/base'

const openKey = ref<GaMegaMenuKey>()
const selectedLabel = ref('暂无')
const menus: GaMegaMenuNavItem[] = [
  { key: 'overview', label: '总览' },
  {
    key: 'products',
    label: '产品',
    groups: [
      {
        key: 'platform',
        title: '平台能力',
        items: [
          { key: 'analytics', label: '数据分析', description: '查看关键指标' },
          { key: 'workflow', label: '工作流', description: '编排自动化流程' },
        ],
      },
      {
        key: 'services',
        title: '服务',
        items: [
          { key: 'support', label: '客户支持', description: '集中处理请求' },
          { key: 'reports', label: '报表中心', description: '汇总业务数据' },
        ],
      },
    ],
  },
  { key: 'contact', label: '联系我们' },
]

function handleSelect(payload: GaMegaMenuSelectPayload) {
  selectedLabel.value = payload.item?.label ?? payload.menu.label
}
</script>

<style scoped>
.mega-demo-nav { height: 72px; }
.mega-demo-result { margin: 14px 0 0; color: #606266; font-size: 13px; }
</style>
