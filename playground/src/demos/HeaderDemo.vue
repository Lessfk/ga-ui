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

    <main class="header-demo__content">
      <h1>头部导航状态</h1>
      <dl class="header-demo__status">
        <div>
          <dt>当前菜单</dt>
          <dd>{{ activeKey }}</dd>
        </div>
        <div>
          <dt>最近选择</dt>
          <dd aria-live="polite">{{ latestSelection }}</dd>
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
  Document,
  FullScreen,
  Grid,
  House,
  Lock,
  Menu,
  Monitor,
  Setting,
  TrendCharts,
  User,
  UserFilled,
} from '@element-plus/icons-vue'
import {
  ElAvatar,
  ElBadge,
  ElButton,
  ElButtonGroup,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElEmpty,
  ElIcon,
  ElInput,
  ElInputNumber,
  ElRadioButton,
  ElRadioGroup,
  ElSelect,
  ElOption,
  ElSwitch,
  ElTag,
  ElTooltip,
} from 'element-plus'
import { computed, markRaw, ref, toRaw, watch } from 'vue'
import type { Component } from 'vue'

import type {
  GaMegaMenuIcon,
  GaMegaMenuIconConfig,
  GaMegaMenuKey,
  GaMegaMenuNavItem,
  GaMegaMenuSelectPayload,
  GaMegaMenuTheme,
  GaMegaMenuTrigger,
} from 'ga-ui-plus/base'
import { GaHeader } from 'ga-ui-plus/business'
import type { GaHeaderExpose } from 'ga-ui-plus/business'

type ThemeName = 'blue' | 'graphite' | 'light'

interface EventLogItem {
  id: number
  event: 'select' | 'open' | 'close' | 'update:activeKey' | 'update:openKey'
  detail: string
  time: string
}

const headerRef = ref<GaHeaderExpose>()
const activeKey = ref<GaMegaMenuKey>('overview')
const openKey = ref<GaMegaMenuKey | undefined>()
const trigger = ref<GaMegaMenuTrigger>('click')
const headerHeight = ref(68)
const headerGap = ref(18)
const headerPadding = ref('0 24px')
const closeOnSelect = ref(true)
const minColumnWidth = ref(240)
const maxColumnWidth = ref(340)
const panelMaxHeight = ref<string | number>(520)
const selectedTheme = ref<ThemeName>('blue')
const latestSelection = ref('等待菜单操作')
const eventLogs = ref<EventLogItem[]>([])
let eventLogId = 0

const menus: GaMegaMenuNavItem[] = [
  { key: 'home', label: '工作台', icon: markRaw(House) },
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
          {
            key: 'audit',
            label: '审计日志',
            description: '该功能尚未开放',
            icon: markRaw(Document),
            disabled: true,
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
            icon: { component: markRaw(Menu), props: { color: '#315c96' } },
          },
          {
            key: 'tenant-config',
            label: '租户配置',
            description: '设置租户级功能和基础参数',
            icon: markRaw(Grid),
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
  {
    key: 'empty',
    label: '待配置',
    icon: markRaw(Monitor),
    groups: [],
  },
  {
    key: 'disabled',
    label: '停用模块',
    icon: markRaw(Lock),
    disabled: true,
  },
]

const themePresets: Record<ThemeName, { label: string; theme: GaMegaMenuTheme }> = {
  blue: {
    label: '深蓝商务',
    theme: {
      menuBackgroundColor: '#263d64',
      menuGap: 6,
      menuItemTextColor: '#dbe7f7',
      menuItemBackgroundColor: 'transparent',
      menuItemBorderColor: 'transparent',
      menuItemHoverTextColor: '#ffffff',
      menuItemHoverBackgroundColor: '#35547f',
      menuItemHoverBorderColor: '#5479a8',
      menuItemActiveTextColor: '#ffffff',
      menuItemActiveBackgroundColor: '#3b66a0',
      menuItemActiveBorderColor: '#84aee0',
      menuItemDisabledTextColor: '#8293ad',
      menuItemDisabledBackgroundColor: 'transparent',
      menuItemDisabledBorderColor: 'transparent',
      menuItemFocusOutlineColor: '#9ec5f3',
      menuItemFontSize: 15,
      menuItemFontWeight: 500,
      menuItemIconSize: 18,
      menuItemGap: 8,
      menuItemHorizontalPadding: 18,
      menuItemVerticalSpace: 20,
      menuItemBorderRadius: 6,
      menuItemShadow: 'none',
      menuItemActiveShadow: 'none',
      panelBackgroundColor: '#f8fafc',
      panelBorderColor: '#d8e1ed',
      panelTopBorderColor: '#d8e1ed',
      panelShadow: '0 16px 36px rgb(31 50 78 / 18%)',
      panelPadding: 24,
      panelGap: 20,
      panelGroupTitleColor: '#66758b',
      panelGroupTitleFontSize: 13,
      panelGroupTitleFontWeight: 650,
      panelGroupTitleMarginBottom: 10,
      panelGroupTitleHorizontalPadding: 4,
      panelItemTextColor: '#253858',
      panelItemBackgroundColor: '#ffffff',
      panelItemBorderColor: '#dce4ee',
      panelItemHoverTextColor: '#244f86',
      panelItemHoverBackgroundColor: '#edf4fc',
      panelItemHoverBorderColor: '#b9cde5',
      panelItemActiveTextColor: '#173f73',
      panelItemActiveBackgroundColor: '#dceaff',
      panelItemActiveBorderColor: '#8eb3df',
      panelItemDisabledTextColor: '#9aa6b7',
      panelItemDisabledBackgroundColor: '#f3f5f7',
      panelItemDisabledBorderColor: '#e3e7ec',
      panelItemFocusOutlineColor: '#6f9bd1',
      panelItemBorderRadius: 6,
      panelItemMinHeight: 76,
      panelItemPadding: 14,
      panelItemGap: 12,
      panelItemListGap: 10,
      panelItemLabelFontSize: 14,
      panelItemLabelFontWeight: 650,
      panelItemDescriptionColor: '#68788d',
      panelItemDescriptionFontSize: 12,
      panelItemDescriptionLineHeight: 1.55,
      panelItemIconColor: '#315c96',
      panelItemIconSize: 18,
      panelItemIconBoxSize: 38,
      panelItemIconBackgroundColor: '#e8eff8',
      panelItemIconBorderRadius: 6,
      panelEmptyTextColor: '#7b8798',
      panelEmptyPadding: 40,
    },
  },
  graphite: {
    label: '石墨深色',
    theme: {
      menuBackgroundColor: '#20252d',
      menuGap: 6,
      menuItemTextColor: '#d9dee7',
      menuItemBackgroundColor: 'transparent',
      menuItemBorderColor: 'transparent',
      menuItemHoverTextColor: '#ffffff',
      menuItemHoverBackgroundColor: '#343b46',
      menuItemHoverBorderColor: '#586270',
      menuItemActiveTextColor: '#ffffff',
      menuItemActiveBackgroundColor: '#3c4654',
      menuItemActiveBorderColor: '#8ca0b8',
      menuItemDisabledTextColor: '#707985',
      menuItemDisabledBackgroundColor: 'transparent',
      menuItemDisabledBorderColor: 'transparent',
      menuItemFocusOutlineColor: '#a9b9cc',
      menuItemFontSize: 15,
      menuItemFontWeight: 500,
      menuItemIconSize: 18,
      menuItemGap: 8,
      menuItemHorizontalPadding: 18,
      menuItemVerticalSpace: 20,
      menuItemBorderRadius: 6,
      menuItemShadow: 'none',
      menuItemActiveShadow: 'none',
      panelBackgroundColor: '#282e37',
      panelBorderColor: '#414a57',
      panelTopBorderColor: '#4d5765',
      panelShadow: '0 18px 42px rgb(10 13 18 / 32%)',
      panelPadding: 24,
      panelGap: 20,
      panelGroupTitleColor: '#aeb8c6',
      panelGroupTitleFontSize: 13,
      panelGroupTitleFontWeight: 650,
      panelGroupTitleMarginBottom: 10,
      panelGroupTitleHorizontalPadding: 4,
      panelItemTextColor: '#eef2f7',
      panelItemBackgroundColor: '#303741',
      panelItemBorderColor: '#46505d',
      panelItemHoverTextColor: '#ffffff',
      panelItemHoverBackgroundColor: '#3a4552',
      panelItemHoverBorderColor: '#69788a',
      panelItemActiveTextColor: '#ffffff',
      panelItemActiveBackgroundColor: '#435266',
      panelItemActiveBorderColor: '#8299b5',
      panelItemDisabledTextColor: '#7e8895',
      panelItemDisabledBackgroundColor: '#2a3038',
      panelItemDisabledBorderColor: '#39414b',
      panelItemFocusOutlineColor: '#9fb2c9',
      panelItemBorderRadius: 6,
      panelItemMinHeight: 76,
      panelItemPadding: 14,
      panelItemGap: 12,
      panelItemListGap: 10,
      panelItemLabelFontSize: 14,
      panelItemLabelFontWeight: 650,
      panelItemDescriptionColor: '#a9b3c0',
      panelItemDescriptionFontSize: 12,
      panelItemDescriptionLineHeight: 1.55,
      panelItemIconColor: '#d8e4f2',
      panelItemIconSize: 18,
      panelItemIconBoxSize: 38,
      panelItemIconBackgroundColor: '#414c5b',
      panelItemIconBorderRadius: 6,
      panelEmptyTextColor: '#9ba6b4',
      panelEmptyPadding: 40,
    },
  },
  light: {
    label: '浅色商务',
    theme: {
      menuBackgroundColor: '#ffffff',
      menuGap: 6,
      menuItemTextColor: '#40526a',
      menuItemBackgroundColor: 'transparent',
      menuItemBorderColor: 'transparent',
      menuItemHoverTextColor: '#234f84',
      menuItemHoverBackgroundColor: '#edf4fc',
      menuItemHoverBorderColor: '#c5d8ee',
      menuItemActiveTextColor: '#173f73',
      menuItemActiveBackgroundColor: '#dceaff',
      menuItemActiveBorderColor: '#8eb3df',
      menuItemDisabledTextColor: '#a5afbc',
      menuItemDisabledBackgroundColor: 'transparent',
      menuItemDisabledBorderColor: 'transparent',
      menuItemFocusOutlineColor: '#5f8fc6',
      menuItemFontSize: 15,
      menuItemFontWeight: 500,
      menuItemIconSize: 18,
      menuItemGap: 8,
      menuItemHorizontalPadding: 18,
      menuItemVerticalSpace: 20,
      menuItemBorderRadius: 6,
      menuItemShadow: 'none',
      menuItemActiveShadow: 'none',
      panelBackgroundColor: '#ffffff',
      panelBorderColor: '#d8e1ed',
      panelTopBorderColor: '#d8e1ed',
      panelShadow: '0 16px 36px rgb(31 50 78 / 14%)',
      panelPadding: 24,
      panelGap: 20,
      panelGroupTitleColor: '#66758b',
      panelGroupTitleFontSize: 13,
      panelGroupTitleFontWeight: 650,
      panelGroupTitleMarginBottom: 10,
      panelGroupTitleHorizontalPadding: 4,
      panelItemTextColor: '#253858',
      panelItemBackgroundColor: '#f8fafc',
      panelItemBorderColor: '#dce4ee',
      panelItemHoverTextColor: '#244f86',
      panelItemHoverBackgroundColor: '#edf4fc',
      panelItemHoverBorderColor: '#b9cde5',
      panelItemActiveTextColor: '#173f73',
      panelItemActiveBackgroundColor: '#dceaff',
      panelItemActiveBorderColor: '#8eb3df',
      panelItemDisabledTextColor: '#a1aab7',
      panelItemDisabledBackgroundColor: '#f1f3f6',
      panelItemDisabledBorderColor: '#e1e5ea',
      panelItemFocusOutlineColor: '#6f9bd1',
      panelItemBorderRadius: 6,
      panelItemMinHeight: 76,
      panelItemPadding: 14,
      panelItemGap: 12,
      panelItemListGap: 10,
      panelItemLabelFontSize: 14,
      panelItemLabelFontWeight: 650,
      panelItemDescriptionColor: '#68788d',
      panelItemDescriptionFontSize: 12,
      panelItemDescriptionLineHeight: 1.55,
      panelItemIconColor: '#315c96',
      panelItemIconSize: 18,
      panelItemIconBoxSize: 38,
      panelItemIconBackgroundColor: '#e8eff8',
      panelItemIconBorderRadius: 6,
      panelEmptyTextColor: '#7b8798',
      panelEmptyPadding: 40,
    },
  },
}

const currentTheme = computed(() => themePresets[selectedTheme.value].theme)
const currentHeaderBackground = computed(
  () => currentTheme.value.menuBackgroundColor ?? '#263d64',
)

watch(minColumnWidth, (value) => {
  if (value > maxColumnWidth.value) maxColumnWidth.value = value
})

watch(maxColumnWidth, (value) => {
  if (value < minColumnWidth.value) minColumnWidth.value = value
})

function appendLog(event: EventLogItem['event'], detail: string) {
  eventLogs.value.unshift({
    id: ++eventLogId,
    event,
    detail,
    time: new Date().toLocaleTimeString('zh-CN', { hour12: false }),
  })
  eventLogs.value = eventLogs.value.slice(0, 12)
}

function handleActiveKeyUpdate(key: GaMegaMenuKey) {
  activeKey.value = key
  appendLog('update:activeKey', `activeKey = ${String(key)}`)
}

function handleOpenKeyUpdate(key: GaMegaMenuKey | undefined) {
  openKey.value = key
  appendLog('update:openKey', `openKey = ${key === undefined ? 'undefined' : String(key)}`)
}

function handleSelect(payload: GaMegaMenuSelectPayload) {
  const selectedLabel = payload.item?.label ?? payload.menu.label
  latestSelection.value = `${selectedLabel}（${payload.source}）`
  appendLog('select', `${selectedLabel} / key: ${String(payload.key)} / source: ${payload.source}`)
}

function handleOpen(key: GaMegaMenuKey, menu: GaMegaMenuNavItem) {
  appendLog('open', `${menu.label} / key: ${String(key)}`)
}

function handleClose(key: GaMegaMenuKey, menu: GaMegaMenuNavItem) {
  appendLog('close', `${menu.label} / key: ${String(key)}`)
}

function openSystemPanel() {
  headerRef.value?.open('system')
}

function closePanel() {
  headerRef.value?.close()
}

function toggleAnalyticsPanel() {
  headerRef.value?.toggle('analytics')
}

async function toggleFullscreen() {
  if (!document.fullscreenElement) {
    await document.documentElement.requestFullscreen?.()
    return
  }
  await document.exitFullscreen?.()
}

function clearLogs() {
  eventLogs.value = []
}

function selectTheme(name: string) {
  if (name in themePresets) selectedTheme.value = name as ThemeName
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
</script>

<style scoped lang="scss">
.header-demo {
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
