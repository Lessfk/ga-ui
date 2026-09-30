<template>
  <GaHeader
    ref="headerRef"
    v-model:active-key="activeKey"
    v-model:open-key="openKey"
    :menus="menus"
    :theme="compactTheme"
    :height="68"
    padding="0 18px"
    :gap="12"
    aria-label="项目工作台导航"
    @select="handleSelect"
  >
    <template #left>
      <div class="demo-brand"><span class="demo-brand__mark">G</span><strong>Ga Workspace</strong></div>
    </template>
    <template #right>
      <div class="demo-account"><ElIcon><Bell /></ElIcon><span>管理员</span></div>
    </template>
  </GaHeader>

  <div class="demo-toolbar">
    <span>当前选择：<strong>{{ selectedLabel }}</strong></span>
    <div class="demo-toolbar__actions">
      <ElButton size="small" @click="headerRef?.open('system')">展开系统管理</ElButton>
      <ElButton size="small" @click="headerRef?.toggle('analytics')">切换数据分析</ElButton>
      <ElButton size="small" @click="headerRef?.close()">关闭面板</ElButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Bell, DataAnalysis, Grid, Setting } from '@element-plus/icons-vue'
import { ElButton, ElIcon } from 'element-plus'
import { ref } from 'vue'
import { type GaMegaMenuKey, type GaMegaMenuNavItem, type GaMegaMenuSelectPayload, type GaMegaMenuTheme } from 'ga-ui-plus/base'
import { GaHeader, type GaHeaderExpose } from 'ga-ui-plus/business'

const headerRef = ref<GaHeaderExpose>()
const activeKey = ref<GaMegaMenuKey>('home')
const openKey = ref<GaMegaMenuKey>()
const selectedLabel = ref('工作台')

const compactTheme: GaMegaMenuTheme = {
  menuItemFontSize: 14,
  menuItemIconSize: 18,
  menuItemHorizontalPadding: 12,
  menuItemVerticalSpace: 14,
  menuItemBorderRadius: 4,
}

const menus: GaMegaMenuNavItem[] = [
  { key: 'home', label: '工作台', icon: Grid },
  {
    key: 'system', label: '系统管理', icon: Setting,
    groups: [
      { key: 'org', title: '组织管理', items: [
        { key: 'users', label: '用户管理', description: '维护用户与所属组织' },
        { key: 'roles', label: '角色权限', description: '配置角色和访问范围' },
      ] },
      { key: 'config', title: '平台设置', items: [
        { key: 'menus', label: '菜单配置', description: '调整导航项目' },
      ] },
    ],
  },
  {
    key: 'analytics', label: '数据分析', icon: DataAnalysis,
    groups: [
      { key: 'reports', title: '分析中心', items: [
        { key: 'sales', label: '销售报表', description: '查看业务趋势' },
        { key: 'traffic', label: '访问分析', description: '了解用户行为' },
      ] },
    ],
  },
]

function handleSelect(payload: GaMegaMenuSelectPayload) {
  selectedLabel.value = payload.item?.label ?? payload.menu.label
}
</script>

<style scoped>
.demo-brand, .demo-account { display: flex; align-items: center; gap: 9px; color: #fff; white-space: nowrap; }
.demo-brand strong { font-size: 14px; }
.demo-brand__mark { display: grid; width: 27px; height: 27px; place-items: center; border-radius: 4px; background: #409eff; font-size: 17px; font-weight: 700; }
.demo-account { font-size: 13px; }
.demo-account .el-icon { font-size: 18px; }
.demo-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 14px; margin-top: 16px; color: #606266; font-size: 13px; }
.demo-toolbar strong { color: #303133; }
.demo-toolbar__actions { display: flex; gap: 6px; }
.demo-toolbar__actions .el-button + .el-button { margin-left: 0; }
</style>
