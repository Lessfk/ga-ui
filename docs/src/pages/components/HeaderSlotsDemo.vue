<template>
  <GaHeader :menus="menus" :theme="theme" :height="68" padding="0 18px" @select="handleSelect">
    <template #left><strong class="demo-brand">Studio Hub</strong></template>
    <template #right><span class="demo-user">设计团队</span></template>

    <template #menu-item="{ menu, open }">
      <span class="custom-menu-label">{{ menu.label }}<ElIcon v-if="menu.groups"><ArrowDown :class="{ 'is-open': open }" /></ElIcon></span>
    </template>
    <template #group-title="{ group }"><strong class="custom-group-title">{{ group.title }}</strong></template>
    <template #panel-item="{ item, active }">
      <span class="custom-panel-item" :class="{ 'is-active': active }">
        <strong>{{ item.label }}</strong><small>{{ item.description }}</small>
      </span>
    </template>
    <template #empty="{ menu }"><span class="custom-empty">{{ menu.label }}暂未配置内容</span></template>
  </GaHeader>
  <p class="demo-result">最近选择：{{ selectedLabel }}</p>
</template>

<script setup lang="ts">
import { ArrowDown } from '@element-plus/icons-vue'
import { ElIcon } from 'element-plus'
import { ref } from 'vue'
import { type GaMegaMenuNavItem, type GaMegaMenuSelectPayload, type GaMegaMenuTheme } from 'ga-ui-plus/base'
import { GaHeader } from 'ga-ui-plus/business'

const selectedLabel = ref('暂无')
const theme: GaMegaMenuTheme = {
  menuItemFontSize: 14, menuItemHorizontalPadding: 15,
  menuItemVerticalSpace: 14, menuItemBorderRadius: 4,
}
const menus: GaMegaMenuNavItem[] = [
  { key: 'projects', label: '项目', groups: [
    { key: 'work', title: '我的工作', items: [
      { key: 'boards', label: '项目看板', description: '跟进里程碑和任务' },
      { key: 'files', label: '文件资源', description: '整理团队共享素材' },
    ] },
  ] },
  { key: 'tools', label: '工具箱', groups: [] },
  { key: 'help', label: '帮助中心' },
]

function handleSelect(payload: GaMegaMenuSelectPayload) {
  selectedLabel.value = payload.item?.label ?? payload.menu.label
}
</script>

<style scoped>
.demo-brand, .demo-user { color: #fff; white-space: nowrap; }
.demo-brand { font-size: 16px; }
.demo-user { font-size: 13px; }
.custom-menu-label { display: flex; align-items: center; gap: 7px; }
.custom-menu-label .el-icon { font-size: 13px; transition: transform 180ms ease; }
.custom-menu-label .is-open { transform: rotate(180deg); }
.custom-group-title { display: block; padding: 0 12px 10px; color: #b7c4da; font-size: 13px; }
.custom-panel-item { display: flex; flex-direction: column; gap: 4px; }
.custom-panel-item strong { font-size: 14px; }
.custom-panel-item small { color: #b7c4da; font-size: 12px; }
.custom-panel-item.is-active strong { text-decoration: underline; }
.custom-empty { display: block; color: #b7c4da; text-align: center; }
.demo-result { margin: 14px 0 0; color: #606266; font-size: 13px; }
</style>
