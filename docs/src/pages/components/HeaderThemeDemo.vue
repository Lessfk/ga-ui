<template>
  <div class="theme-controls">
    <ElRadioGroup v-model="themeName" aria-label="头部主题">
      <ElRadioButton value="default"><span class="theme-dot theme-dot--blue" />默认深蓝</ElRadioButton>
      <ElRadioButton value="light"><span class="theme-dot theme-dot--light" />浅色</ElRadioButton>
      <ElRadioButton value="teal"><span class="theme-dot theme-dot--teal" />青绿</ElRadioButton>
    </ElRadioGroup>
    <ElSwitch v-model="overrideBackground" active-text="覆盖导航背景" aria-label="覆盖导航背景" />
  </div>
  <GaHeader
    :menus="menus"
    :theme="themes[themeName]"
    :background-color="overrideBackground ? backgrounds[themeName] : undefined"
    :style="{ color: themeName === 'light' ? '#243b55' : '#ffffff' }"
    :height="72"
    padding="0 22px"
    :gap="20"
  >
    <template #left><strong class="theme-brand">Ga Console</strong></template>
    <template #right><span class="theme-account">管理中心</span></template>
  </GaHeader>
</template>

<script setup lang="ts">
import { ElRadioButton, ElRadioGroup, ElSwitch } from 'element-plus'
import { ref } from 'vue'
import { type GaMegaMenuNavItem, type GaMegaMenuTheme } from 'ga-ui-plus/base'
import { GaHeader } from 'ga-ui-plus/business'

type ThemeName = 'default' | 'light' | 'teal'

const themeName = ref<ThemeName>('default')
const overrideBackground = ref(false)
const menus: GaMegaMenuNavItem[] = [
  { key: 'home', label: '工作台' },
  { key: 'services', label: '服务中心', groups: [
    { key: 'core', title: '核心服务', items: [
      { key: 'projects', label: '项目管理', description: '查看项目与进度' },
      { key: 'tasks', label: '任务中心', description: '分配与跟进任务' },
    ] },
  ] },
  { key: 'reports', label: '数据报表' },
]

const themes: Record<ThemeName, GaMegaMenuTheme | undefined> = {
  default: { menuItemFontSize: 14, menuItemHorizontalPadding: 14, menuItemVerticalSpace: 16, menuItemBorderRadius: 4 },
  light: {
    menuBackgroundColor: '#eef5fc',
    menuItemTextColor: '#30445d', menuItemBackgroundColor: '#ffffff',
    menuItemHoverTextColor: '#17427a', menuItemHoverBackgroundColor: '#e4efff',
    menuItemActiveTextColor: '#17427a', menuItemActiveBackgroundColor: '#d9eafd',
    menuItemActiveBorderColor: '#9ec4f2',
    panelBackgroundColor: '#ffffff', panelBorderColor: '#d8e1ed',
    panelGroupTitleColor: '#66788e', panelItemTextColor: '#253858',
    panelItemBackgroundColor: '#f3f7fb', panelItemDescriptionColor: '#66788e',
    panelItemHoverTextColor: '#17427a', panelItemHoverBackgroundColor: '#e4efff',
    panelItemActiveTextColor: '#17427a', panelItemActiveBackgroundColor: '#d9eafd',
    menuItemFontSize: 14, menuItemHorizontalPadding: 14, menuItemVerticalSpace: 16, menuItemBorderRadius: 4,
  },
  teal: {
    menuBackgroundColor: '#174b4b', menuItemBackgroundColor: '#236260',
    menuItemHoverBackgroundColor: '#2d7772', menuItemActiveBackgroundColor: '#1c8179',
    panelBackgroundColor: '#f2fbf8', panelBorderColor: '#c5e3db',
    panelGroupTitleColor: '#4d766e', panelItemTextColor: '#204b44',
    panelItemBackgroundColor: '#ffffff', panelItemDescriptionColor: '#5d7d74',
    panelItemHoverTextColor: '#12655a', panelItemHoverBackgroundColor: '#e0f3ec',
    panelItemActiveTextColor: '#12655a', panelItemActiveBackgroundColor: '#ccece0',
    menuItemFontSize: 14, menuItemHorizontalPadding: 14, menuItemVerticalSpace: 16, menuItemBorderRadius: 4,
  },
}
const backgrounds: Record<ThemeName, string> = {
  default: '#15375e', light: '#d8eaff', teal: '#12665e',
}
</script>

<style scoped>
.theme-controls { display: flex; flex-wrap: wrap; align-items: center; gap: 18px; margin-bottom: 16px; }
.theme-brand { font-size: 16px; white-space: nowrap; }
.theme-account { font-size: 13px; white-space: nowrap; }
.theme-dot { display: inline-block; width: 9px; height: 9px; margin-right: 7px; border: 1px solid rgb(48 49 51 / 20%); border-radius: 50%; vertical-align: 1px; }
.theme-dot--blue { background: #2f436b; }
.theme-dot--light { background: #eef5fc; }
.theme-dot--teal { background: #174b4b; }
</style>
