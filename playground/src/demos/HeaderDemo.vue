<template>
  <section class="header-demo">
    <GaHeader
      v-model:active-key="activeKey"
      v-model:open-key="openKey"
      :menus="menus"
      :theme="theme"
      :min-column-width="260"
      :max-column-width="360"
      trigger="click"
      @select="handleSelect"
    >
      <template #left>
        <div class="header-demo__brand">
          <span class="header-demo__logo" aria-hidden="true">GA</span>
          <strong>运营管理平台</strong>
        </div>
      </template>

      <template #menu-item="{ menu, active }">
        <span class="header-demo__menu-content">
          <span
            v-if="menu.icon"
            class="header-demo__menu-icon"
            aria-hidden="true"
          >
            <component
              :is="resolveIconComponent(menu.icon)"
              v-bind="resolveIconProps(menu.icon)"
            />
          </span>
          <span class="header-demo__menu-label">{{ menu.label }}</span>
          <span
            v-if="active"
            class="header-demo__active-dot"
            aria-hidden="true"
          />
        </span>
      </template>

      <template #right>
        <div class="header-demo__user-area">
          <ElBadge is-dot>
            <ElButton
              :icon="Bell"
              circle
              text
              aria-label="通知"
              class="header-demo__notification"
            />
          </ElBadge>

          <ElDropdown trigger="click">
            <button
              type="button"
              class="header-demo__user-button"
              aria-label="打开用户菜单"
            >
              <ElAvatar :size="34">GA</ElAvatar>
              <span>管理员</span>
              <ElIcon><ArrowDown /></ElIcon>
            </button>

            <template #dropdown>
              <ElDropdownMenu>
                <ElDropdownItem>个人中心</ElDropdownItem>
                <ElDropdownItem divided>退出登录</ElDropdownItem>
              </ElDropdownMenu>
            </template>
          </ElDropdown>
        </div>
      </template>
    </GaHeader>

    <main class="header-demo__content" aria-live="polite">
      <h1>头部导航状态</h1>
      <dl class="header-demo__status">
        <div>
          <dt>当前菜单</dt>
          <dd>{{ activeKey }}</dd>
        </div>
        <div>
          <dt>最近选择</dt>
          <dd>{{ latestSelection }}</dd>
        </div>
      </dl>
    </main>
  </section>
</template>

<script setup lang="ts">
import {
  ArrowDown,
  Bell,
  DataAnalysis,
  House,
  Lock,
  Menu,
  Setting,
  TrendCharts,
  User,
} from '@element-plus/icons-vue'
import {
  ElAvatar,
  ElBadge,
  ElButton,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElIcon,
} from 'element-plus'
import { markRaw, ref, toRaw } from 'vue'
import type { Component } from 'vue'

import type {
  GaMegaMenuIcon,
  GaMegaMenuIconConfig,
  GaMegaMenuKey,
  GaMegaMenuNavItem,
  GaMegaMenuSelectPayload,
  GaMegaMenuTheme,
} from 'ga-ui-plus/base'
import { GaHeader } from 'ga-ui-plus/business'

const activeKey = ref<GaMegaMenuKey>('overview')
const openKey = ref<GaMegaMenuKey | undefined>()
const latestSelection = ref('等待菜单操作')

const menus: GaMegaMenuNavItem[] = [
  {
    key: 'home',
    label: '工作台',
    icon: markRaw(House),
  },
  {
    key: 'system',
    label: '系统管理',
    icon: markRaw(Setting),
    groups: [
      {
        key: 'organization',
        title: '组织与权限',
        items: [
          {
            key: 'users',
            label: '用户管理',
            description: '维护用户账号、状态和所属组织',
            icon: markRaw(User),
          },
          {
            key: 'roles',
            label: '角色权限',
            description: '配置角色能力和数据访问范围',
            icon: markRaw(Lock),
          },
        ],
      },
      {
        key: 'platform',
        title: '平台配置',
        items: [
          {
            key: 'menu-config',
            label: '菜单配置',
            description: '维护业务导航和菜单展示顺序',
            icon: markRaw(Menu),
          },
        ],
      },
    ],
  },
  {
    key: 'analytics',
    label: '数据分析',
    icon: markRaw(DataAnalysis),
    groups: [
      {
        key: 'analysis-center',
        title: '经营分析',
        items: [
          {
            key: 'overview',
            label: '经营概览',
            description: '查看核心经营指标和实时趋势',
            icon: markRaw(TrendCharts),
          },
          {
            key: 'reports',
            label: '分析报表',
            description: '按业务维度生成和保存分析视图',
            icon: markRaw(DataAnalysis),
          },
        ],
      },
    ],
  },
]

const theme: GaMegaMenuTheme = {
  menuBackgroundColor: '#263d64',
  menuGap: 6,
  menuItemTextColor: '#dbe7f7',
  menuItemBackgroundColor: 'transparent',
  menuItemHoverTextColor: '#ffffff',
  menuItemHoverBackgroundColor: '#35547f',
  menuItemActiveTextColor: '#ffffff',
  menuItemActiveBackgroundColor: '#3b66a0',
  menuItemActiveBorderColor: '#6f9bd1',
  menuItemBorderRadius: 6,
  menuItemFontSize: 15,
  menuItemHorizontalPadding: 18,
  menuItemVerticalSpace: 20,
  menuItemIconSize: 18,
  menuItemGap: 8,
  menuItemShadow: 'none',
  menuItemActiveShadow: 'none',
  panelBackgroundColor: '#f8fafc',
  panelBorderColor: '#d8e1ed',
  panelTopBorderColor: '#d8e1ed',
  panelShadow: '0 16px 36px rgb(31 50 78 / 18%)',
  panelPadding: 24,
  panelGap: 20,
  panelGroupTitleColor: '#66758b',
  panelItemTextColor: '#253858',
  panelItemBackgroundColor: '#ffffff',
  panelItemBorderColor: '#dce4ee',
  panelItemHoverTextColor: '#244f86',
  panelItemHoverBackgroundColor: '#edf4fc',
  panelItemHoverBorderColor: '#b9cde5',
  panelItemActiveTextColor: '#173f73',
  panelItemActiveBackgroundColor: '#dceaff',
  panelItemActiveBorderColor: '#8eb3df',
  panelItemDescriptionColor: '#68788d',
  panelItemIconColor: '#315c96',
  panelItemIconBackgroundColor: '#e8eff8',
  panelItemBorderRadius: 6,
}

function isIconConfig(icon: GaMegaMenuIcon): icon is GaMegaMenuIconConfig {
  return typeof icon === 'object' && icon !== null && 'component' in icon
}

function resolveIconComponent(icon: GaMegaMenuIcon): Component {
  return toRaw(isIconConfig(icon) ? icon.component : icon)
}

function resolveIconProps(icon: GaMegaMenuIcon) {
  return isIconConfig(icon) ? icon.props : undefined
}

function handleSelect(payload: GaMegaMenuSelectPayload) {
  latestSelection.value = payload.item?.label ?? payload.menu.label
}
</script>

<style scoped lang="scss">
.header-demo {
  min-width: 1080px;
  min-height: 100%;
  color: #172033;
  background: #f3f6f9;
}

.header-demo__brand,
.header-demo__user-area,
.header-demo__user-button,
.header-demo__menu-content {
  display: flex;
  align-items: center;
}

.header-demo__brand {
  gap: 10px;
  color: #ffffff;
  font-size: 16px;
  white-space: nowrap;
}

.header-demo__logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  font-size: 12px;
  font-weight: 800;
  background: rgb(255 255 255 / 12%);
  border: 1px solid rgb(255 255 255 / 20%);
  border-radius: 6px;
}

.header-demo__menu-content {
  min-width: 0;
  gap: 8px;
}

.header-demo__menu-icon {
  display: inline-flex;
  width: 18px;
  height: 18px;
  flex: 0 0 auto;
}

.header-demo__menu-icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.header-demo__menu-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.header-demo__active-dot {
  width: 5px;
  height: 5px;
  flex: 0 0 auto;
  background: #b9dcff;
  border-radius: 50%;
}

.header-demo__user-area {
  gap: 14px;
  color: #ffffff;
  white-space: nowrap;
}

.header-demo__notification {
  color: #ffffff;
}

.header-demo__notification:hover,
.header-demo__notification:focus-visible {
  color: #ffffff;
  background: rgb(255 255 255 / 12%);
}

.header-demo__user-button {
  gap: 8px;
  min-height: 42px;
  padding: 4px 8px;
  color: #ffffff;
  font: inherit;
  background: transparent;
  border: 0;
  border-radius: 6px;
  cursor: pointer;
}

.header-demo__user-button:hover,
.header-demo__user-button:focus-visible {
  background: rgb(255 255 255 / 10%);
  outline: none;
}

.header-demo__user-button:focus-visible {
  box-shadow: 0 0 0 2px #8db7f0;
}

.header-demo__content {
  width: min(1180px, calc(100% - 64px));
  margin: 0 auto;
  padding: 48px 0;
}

.header-demo__content h1 {
  margin: 0 0 28px;
  font-size: 18px;
  font-weight: 650;
}

.header-demo__status {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 280px));
  gap: 64px;
  margin: 0;
}

.header-demo__status > div {
  min-width: 0;
  padding-left: 14px;
  border-left: 3px solid #8eb3df;
}

.header-demo__status dt {
  margin-bottom: 8px;
  color: #68788d;
  font-size: 13px;
}

.header-demo__status dd {
  overflow: hidden;
  margin: 0;
  color: #20345d;
  font-size: 22px;
  font-weight: 650;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
