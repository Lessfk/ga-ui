<template>
  <div class="mega-theme-controls" role="group" aria-label="菜单主题">
    <ElRadioGroup v-model="activeTheme">
      <ElRadioButton value="default"><span class="theme-dot theme-dot--blue" />默认深蓝</ElRadioButton>
      <ElRadioButton value="light"><span class="theme-dot theme-dot--light" />浅色</ElRadioButton>
      <ElRadioButton value="teal"><span class="theme-dot theme-dot--teal" />青绿</ElRadioButton>
    </ElRadioGroup>
  </div>
  <div class="mega-demo-nav">
    <GaMegaMenu
      v-model:open-key="openKey"
      :menus="menus"
      :theme="themes[activeTheme]"
      :max-height="320"
    />
  </div>
</template>

<script setup lang="ts">
import { ElRadioButton, ElRadioGroup } from 'element-plus'
import { ref } from 'vue'
import {
  GaMegaMenu,
  type GaMegaMenuKey,
  type GaMegaMenuNavItem,
  type GaMegaMenuTheme,
} from 'ga-ui-plus/base'

const menus: GaMegaMenuNavItem[] = [
  { key: 'home', label: '工作台' },
  {
    key: 'solutions',
    label: '解决方案',
    groups: [
      {
        key: 'teams',
        title: '团队协作',
        items: [
          { key: 'projects', label: '项目管理', description: '跟进项目进展' },
          { key: 'tasks', label: '任务中心', description: '分配和追踪任务' },
        ],
      },
      {
        key: 'insights',
        title: '数据洞察',
        items: [
          { key: 'dashboard', label: '数据看板', description: '掌握实时动态' },
          { key: 'reports', label: '分析报告', description: '沉淀业务结果' },
        ],
      },
    ],
  },
  { key: 'about', label: '关于我们' },
]

const themes: Record<'default' | 'light' | 'teal', GaMegaMenuTheme | undefined> = {
  default: undefined,
  light: {
    menuBackgroundColor: '#edf3f9',
    menuItemTextColor: '#30445d',
    menuItemBackgroundColor: '#ffffff',
    menuItemHoverTextColor: '#17427a',
    menuItemHoverBackgroundColor: '#e4efff',
    menuItemActiveTextColor: '#17427a',
    menuItemActiveBackgroundColor: '#d9eafd',
    menuItemActiveBorderColor: '#9ec4f2',
    panelBackgroundColor: '#ffffff',
    panelBorderColor: '#d8e1ed',
    panelGroupTitleColor: '#66788e',
    panelItemTextColor: '#253858',
    panelItemBackgroundColor: '#f3f7fb',
    panelItemHoverTextColor: '#17427a',
    panelItemHoverBackgroundColor: '#e4efff',
    panelItemActiveTextColor: '#17427a',
    panelItemActiveBackgroundColor: '#d9eafd',
    panelItemDescriptionColor: '#66788e',
  },
  teal: {
    menuBackgroundColor: '#174b4b',
    menuItemBackgroundColor: '#236260',
    menuItemHoverBackgroundColor: '#2d7772',
    menuItemActiveBackgroundColor: '#1c8179',
    panelBackgroundColor: '#f2fbf8',
    panelBorderColor: '#c5e3db',
    panelGroupTitleColor: '#4d766e',
    panelItemTextColor: '#204b44',
    panelItemBackgroundColor: '#ffffff',
    panelItemHoverTextColor: '#12655a',
    panelItemHoverBackgroundColor: '#e0f3ec',
    panelItemActiveTextColor: '#12655a',
    panelItemActiveBackgroundColor: '#ccece0',
    panelItemDescriptionColor: '#5d7d74',
  },
}

const activeTheme = ref<keyof typeof themes>('default')
const openKey = ref<GaMegaMenuKey>()
</script>

<style scoped>
.mega-theme-controls { margin-bottom: 16px; }
.mega-demo-nav { height: 72px; }

.theme-dot {
  display: inline-block;
  width: 9px;
  height: 9px;
  margin-right: 7px;
  border: 1px solid rgb(48 49 51 / 20%);
  border-radius: 50%;
  vertical-align: 1px;
}

.theme-dot--blue { background: #2f436b; }
.theme-dot--light { background: #edf3f9; }
.theme-dot--teal { background: #174b4b; }
</style>
