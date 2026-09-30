<template>
  <div class="mega-demo-nav">
    <GaMegaMenu
      ref="menuInstance"
      v-model:active-key="activeKey"
      v-model:open-key="openKey"
      :menus="menus"
      :max-height="360"
      @select="handleSelect"
    />
  </div>
  <div class="mega-demo-toolbar">
    <span>当前选择：{{ selectedLabel }}</span>
    <div>
      <ElButton @click="menuInstance?.open('system')">展开系统管理</ElButton>
      <ElButton @click="menuInstance?.close()">关闭面板</ElButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Grid, Setting, User } from '@element-plus/icons-vue'
import { ElButton } from 'element-plus'
import { ref } from 'vue'
import {
  GaMegaMenu,
  type GaMegaMenuExpose,
  type GaMegaMenuKey,
  type GaMegaMenuNavItem,
  type GaMegaMenuSelectPayload,
} from 'ga-ui-plus/base'

const activeKey = ref<GaMegaMenuKey>('home')
const openKey = ref<GaMegaMenuKey>()
const selectedLabel = ref('工作台')
const menuInstance = ref<GaMegaMenuExpose>()

const menus: GaMegaMenuNavItem[] = [
  { key: 'home', label: '工作台', icon: Grid },
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
          { key: 'audit', label: '审计日志', description: '查看操作记录' },
          { key: 'permissions', label: '权限配置', description: '管理访问策略' },
        ],
      },
    ],
  },
  { key: 'help', label: '帮助文档' },
]

function handleSelect(payload: GaMegaMenuSelectPayload) {
  selectedLabel.value = payload.item?.label ?? payload.menu.label
}
</script>

<style scoped>
.mega-demo-nav { height: 72px; }

.mega-demo-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 16px;
  color: #606266;
  font-size: 13px;
}

.mega-demo-toolbar :deep(.el-button + .el-button) { margin-left: 8px; }
</style>
