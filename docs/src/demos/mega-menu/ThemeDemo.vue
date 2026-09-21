<template>
  <div class="mega-demo-nav">
    <GaMegaMenu
      v-model:active-key="activeKey"
      :menus="menus"
      trigger="hover"
      :theme="theme"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import {
  GaMegaMenu,
  type GaMegaMenuKey,
  type GaMegaMenuNavItem,
  type GaMegaMenuTheme,
} from 'ga-ui-plus/base'

const activeKey = ref<GaMegaMenuKey>('system')

const menus: GaMegaMenuNavItem[] = [
  { key: 'overview', label: '工作台' },
  {
    key: 'system',
    label: '系统管理',
    groups: [
      {
        key: 'organization',
        title: '组织管理',
        items: [
          { key: 'users', label: '用户管理', description: '维护用户与状态' },
          { key: 'roles', label: '角色管理', description: '配置角色权限' },
        ],
      },
    ],
  },
]

/** 深色一级导航 + 浅色二级面板，两个区域的主题互不干扰 */
const theme: GaMegaMenuTheme = {
  menuBackgroundColor: '#2f436b',
  menuItemTextColor: '#ffffff',
  menuItemBackgroundColor: '#3d527c',
  menuItemHoverBackgroundColor: '#465d89',
  menuItemActiveBackgroundColor: '#315c96',
  panelBackgroundColor: '#f4f7fb',
  panelBorderColor: '#d8e1ed',
  panelGroupTitleColor: '#52657d',
  panelItemTextColor: '#253858',
  panelItemBackgroundColor: '#ffffff',
  panelItemHoverBackgroundColor: '#eaf2ff',
  panelItemDescriptionColor: '#66788e',
  panelItemIconColor: '#315c96',
  panelItemIconBackgroundColor: '#e6eef8',
}
</script>

<style scoped>
/* GaMegaMenu 根节点为 height: 100%，需要固定高度的头部容器承载 */
.mega-demo-nav {
  height: 64px;
}
</style>
