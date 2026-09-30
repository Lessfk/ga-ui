<template>
  <div class="width-controls">
    <ElRadioGroup v-model="widthMode" aria-label="面板宽度模式">
      <ElRadioButton value="menu">跟随一级菜单</ElRadioButton>
      <ElRadioButton value="px">px</ElRadioButton>
      <ElRadioButton value="%">%</ElRadioButton>
      <ElRadioButton value="vw">vw</ElRadioButton>
    </ElRadioGroup>
    <ElInputNumber
      v-if="widthMode !== 'menu'"
      v-model="customWidth"
      :min="widthMode === 'px' ? 160 : 10"
      :max="widthMode === 'px' ? 1600 : 100"
      :step="widthMode === 'px' ? 40 : 5"
      :aria-label="`面板宽度（${widthMode}）`"
    />
  </div>
  <div class="width-demo-nav">
    <GaMegaMenu
      v-model:open-key="openKey"
      :menus="menus"
      :panel-width="panelWidth"
      :max-height="320"
    />
  </div>
</template>

<script setup lang="ts">
import { ElInputNumber, ElRadioButton, ElRadioGroup } from 'element-plus'
import { computed, ref, watch } from 'vue'
import { GaMegaMenu, type GaMegaMenuKey, type GaMegaMenuNavItem } from 'ga-ui-plus/base'

const widthMode = ref<'menu' | 'px' | '%' | 'vw'>('menu')
const customWidth = ref(720)
const panelWidth = computed(() => {
  if (widthMode.value === 'menu') return 'menu'
  return widthMode.value === 'px' ? customWidth.value : `${customWidth.value}${widthMode.value}`
})

watch(widthMode, (mode) => {
  if (mode === 'px') customWidth.value = 720
  if (mode === '%') customWidth.value = 50
  if (mode === 'vw') customWidth.value = 60
})
const openKey = ref<GaMegaMenuKey>()
const menus: GaMegaMenuNavItem[] = [
  { key: 'home', label: '工作台' },
  {
    key: 'services', label: '服务中心', groups: [
      { key: 'projects', title: '项目管理', items: [
        { key: 'boards', label: '项目看板', description: '跟进团队项目进度' },
        { key: 'tasks', label: '任务中心', description: '管理待办与责任人' },
      ] },
      { key: 'insights', title: '数据洞察', items: [
        { key: 'dashboard', label: '数据看板', description: '查看实时业务指标' },
        { key: 'reports', label: '分析报告', description: '沉淀统计结果' },
      ] },
    ],
  },
  { key: 'help', label: '帮助文档' },
]
</script>

<style scoped>
.width-controls { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-bottom: 16px; }
.width-controls .el-input-number { width: 150px; }
.width-demo-nav { height: 72px; }
</style>
