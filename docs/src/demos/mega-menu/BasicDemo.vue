<template>
  <div class="mega-demo-nav">
    <GaMegaMenu
      v-model:active-key="activeKey"
      v-model:open-key="openKey"
      :menus="menus"
      trigger="click"
      @select="handleSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { Grid, Setting, User } from '@element-plus/icons-vue'
import { ref } from 'vue'

import {
  GaMegaMenu,
  type GaMegaMenuKey,
  type GaMegaMenuNavItem,
  type GaMegaMenuSelectPayload,
} from 'ga-ui-plus/base'

const activeKey = ref<GaMegaMenuKey>('overview')
const openKey = ref<GaMegaMenuKey>()

const menus: GaMegaMenuNavItem[] = [
  { key: 'overview', label: '工作台', icon: Grid },
  {
    key: 'system',
    label: '系统管理',
    icon: Setting,
    groups: [
      {
        key: 'organization',
        title: '组织管理',
        items: [
          { key: 'users', label: '用户管理', description: '维护用户与状态', icon: User },
          { key: 'roles', label: '角色管理', description: '配置角色权限' },
        ],
      },
      {
        key: 'security',
        title: '安全中心',
        items: [
          { key: 'audit', label: '审计日志', description: '查看操作审计记录' },
          { key: 'permission', label: '权限配置', description: '管理访问权限策略' },
        ],
      },
    ],
  },
  { key: 'docs', label: '帮助文档' },
]

function handleSelect(payload: GaMegaMenuSelectPayload) {
  console.log(payload.key, payload.source)
}
</script>

<style scoped>
/* GaMegaMenu 根节点为 height: 100%，需要固定高度的头部容器承载 */
.mega-demo-nav {
  height: 64px;
}
</style>
