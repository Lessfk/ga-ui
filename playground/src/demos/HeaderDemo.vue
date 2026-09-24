<template>
  <section class="header-demo">
    <div class="header-demo__preview-label">实时预览</div>

    <GaHeader
      ref="headerRef"
      :class="{ 'header-demo__header--light': selectedTheme === 'light' }"
      :active-key="activeKey"
      :open-key="openKey"
      :menus="menus"
      :theme="currentTheme"
      :background-color="currentHeaderBackground"
      :height="headerHeight"
      :padding="headerPadding"
      :gap="headerGap"
      :trigger="trigger"
      :close-on-select="closeOnSelect"
      :min-column-width="minColumnWidth"
      :max-column-width="maxColumnWidth"
      :max-height="panelMaxHeight"
      aria-label="运营管理平台主导航"
      @update:active-key="handleActiveKeyUpdate"
      @update:open-key="handleOpenKeyUpdate"
      @select="handleSelect"
      @open="handleOpen"
      @close="handleClose"
    >
      <template #left>
        <div class="header-demo__brand">
          <span class="header-demo__logo" aria-hidden="true">GA</span>
          <span class="header-demo__brand-name">运营管理平台</span>
          <ElTag size="small" effect="dark" type="success">正式环境</ElTag>
        </div>
      </template>

      <template #menu-item="{ menu, active, open }">
        <span class="header-demo__menu-content">
          <span
            v-if="menu.icon"
            class="header-demo__menu-icon ga-mega-menu__icon"
            aria-hidden="true"
          >
            <component
              :is="resolveIconComponent(menu.icon)"
              v-bind="resolveIconProps(menu.icon)"
            />
          </span>
          <span class="header-demo__menu-label">{{ menu.label }}</span>
          <span v-if="open" class="header-demo__open-mark">展开</span>
          <span v-if="active" class="header-demo__active-dot" aria-hidden="true" />
        </span>
      </template>

      <template #group-title="{ group }">
        <span class="header-demo__group-title ga-mega-menu__group-title">
          <span class="header-demo__group-line" />
          {{ group.title || '未命名分组' }}
        </span>
      </template>

      <template #panel-item="{ item, active }">
        <span class="header-demo__panel-item" :class="{ 'is-active': active }">
          <span
            v-if="item.icon"
            class="header-demo__panel-icon ga-mega-menu__item-icon"
            aria-hidden="true"
          >
            <component
              :is="resolveIconComponent(item.icon)"
              v-bind="resolveIconProps(item.icon)"
            />
          </span>
          <span class="header-demo__panel-copy ga-mega-menu__item-content">
            <span class="header-demo__panel-label ga-mega-menu__item-label">
              {{ item.label }}
              <ElTag v-if="item.disabled" size="small" type="info">不可用</ElTag>
            </span>
            <span
              v-if="item.description"
              class="header-demo__panel-description ga-mega-menu__item-description"
            >
              {{ item.description }}
            </span>
          </span>
        </span>
      </template>

      <template #empty="{ menu }">
        <ElEmpty
          class="header-demo__empty"
          :image-size="56"
          :description="`${menu.label}暂未配置功能`"
        />
      </template>

      <template #right>
        <div class="header-demo__user-area">
          <ElTooltip :content="isFullscreen ? '退出全屏' : '进入全屏'" placement="bottom">
            <ElButton
              :icon="FullScreen"
              circle
              text
              :aria-label="isFullscreen ? '退出全屏' : '进入全屏'"
              class="header-demo__header-action"
              @click="toggleFullscreen"
            />
          </ElTooltip>
          <ElBadge is-dot>
            <ElButton
              :icon="Bell"
              circle
              text
              aria-label="通知"
              class="header-demo__header-action"
            />
          </ElBadge>
          <ElDropdown trigger="click">
            <button type="button" class="header-demo__user-button" aria-label="打开用户菜单">
              <ElAvatar :size="34" :icon="UserFilled" />
              <span>管理员</span>
              <ElIcon><ArrowDown /></ElIcon>
            </button>
            <template #dropdown>
              <ElDropdownMenu>
                <ElDropdownItem>个人中心</ElDropdownItem>
                <ElDropdownItem>系统设置</ElDropdownItem>
                <ElDropdownItem divided>退出登录</ElDropdownItem>
              </ElDropdownMenu>
            </template>
          </ElDropdown>
        </div>
      </template>
    </GaHeader>

    <main class="header-demo__workspace">
      <section class="header-demo__section" aria-labelledby="header-config-title">
        <div class="header-demo__section-heading">
          <div>
            <p class="header-demo__eyebrow">Props</p>
            <h2 id="header-config-title">布局与菜单配置</h2>
          </div>
        </div>
        <div class="header-demo__control-grid">
          <fieldset class="header-demo__control">
            <legend id="header-trigger-label">触发方式</legend>
            <ElRadioGroup v-model="trigger" size="small" aria-labelledby="header-trigger-label">
              <ElRadioButton value="click">点击</ElRadioButton>
              <ElRadioButton value="hover">悬停</ElRadioButton>
            </ElRadioGroup>
          </fieldset>
          <div class="header-demo__control">
            <label for="header-close-on-select">选择后关闭</label>
            <ElSwitch id="header-close-on-select" v-model="closeOnSelect" />
          </div>
          <div class="header-demo__control">
            <label for="header-height">头部高度</label>
            <ElInputNumber
              id="header-height"
              v-model="headerHeight"
              :min="56"
              :max="96"
              :step="2"
            />
          </div>
          <div class="header-demo__control">
            <label for="header-gap">区域间距</label>
            <ElInputNumber
              id="header-gap"
              v-model="headerGap"
              :min="0"
              :max="48"
              :step="2"
            />
          </div>
          <div class="header-demo__control header-demo__control--wide">
            <label for="header-padding">内边距</label>
            <ElInput
              id="header-padding"
              v-model="headerPadding"
              placeholder="例如：0 24px"
            />
          </div>
          <div class="header-demo__control">
            <label for="header-min-column-width">最小列宽</label>
            <ElInputNumber
              id="header-min-column-width"
              v-model="minColumnWidth"
              :min="180"
              :max="420"
              :step="10"
            />
          </div>
          <div class="header-demo__control">
            <label for="header-max-column-width">最大列宽</label>
            <ElInputNumber
              id="header-max-column-width"
              v-model="maxColumnWidth"
              :min="180"
              :max="520"
              :step="10"
            />
          </div>
          <div class="header-demo__control">
            <label for="header-panel-max-height">面板最大高度</label>
            <ElSelect id="header-panel-max-height" v-model="panelMaxHeight">
              <ElOption label="自动" value="auto" />
              <ElOption label="420px" :value="420" />
              <ElOption label="520px" :value="520" />
              <ElOption label="640px" :value="640" />
            </ElSelect>
          </div>
        </div>
      </section>

      <section class="header-demo__section" aria-labelledby="header-theme-title">
        <div class="header-demo__section-heading">
          <div>
            <p class="header-demo__eyebrow">Theme</p>
            <h2 id="header-theme-title">主题预设</h2>
          </div>
        </div>
        <div class="header-demo__theme-list">
          <button
            v-for="(preset, key) in themePresets"
            :key="key"
            type="button"
            class="header-demo__theme-option"
            :class="{ 'is-active': selectedTheme === key }"
            :aria-pressed="selectedTheme === key"
            @click="selectTheme(key)"
          >
            <span
              class="header-demo__theme-swatch"
              :style="{ background: preset.theme.menuBackgroundColor }"
            />
            <span>{{ preset.label }}</span>
          </button>
        </div>
      </section>

      <section class="header-demo__section" aria-labelledby="header-method-title">
        <div class="header-demo__section-heading">
          <div>
            <p class="header-demo__eyebrow">Expose</p>
            <h2 id="header-method-title">实例方法</h2>
          </div>
        </div>
        <ElButtonGroup>
          <ElButton type="primary" @click="openSystemPanel">open('system')</ElButton>
          <ElButton @click="toggleAnalyticsPanel">toggle('analytics')</ElButton>
          <ElButton @click="closePanel">close()</ElButton>
        </ElButtonGroup>
      </section>

      <section class="header-demo__section" aria-labelledby="header-state-title">
        <div class="header-demo__section-heading">
          <div>
            <p class="header-demo__eyebrow">State</p>
            <h2 id="header-state-title">实时状态</h2>
          </div>
        </div>
        <dl class="header-demo__status-grid">
          <div><dt>activeKey</dt><dd>{{ activeKey }}</dd></div>
          <div><dt>openKey</dt><dd>{{ openKey ?? 'undefined' }}</dd></div>
          <div><dt>trigger</dt><dd>{{ trigger }}</dd></div>
          <div><dt>最近选择</dt><dd>{{ latestSelection }}</dd></div>
        </dl>
      </section>

      <section class="header-demo__section" aria-labelledby="header-events-title">
        <div class="header-demo__section-heading">
          <div>
            <p class="header-demo__eyebrow">Events</p>
            <h2 id="header-events-title">事件日志</h2>
          </div>
          <ElButton text :disabled="eventLogs.length === 0" @click="clearLogs">清空</ElButton>
        </div>
        <div v-if="eventLogs.length" class="header-demo__event-list" aria-live="polite">
          <div v-for="log in eventLogs" :key="log.id" class="header-demo__event-row">
            <code>{{ log.event }}</code>
            <span>{{ log.detail }}</span>
            <time>{{ log.time }}</time>
          </div>
        </div>
        <div v-else class="header-demo__event-empty">操作顶部菜单后，这里会显示事件。</div>
      </section>
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
  ElMessage,
  ElRadioButton,
  ElRadioGroup,
  ElSelect,
  ElOption,
  ElSwitch,
  ElTag,
  ElTooltip,
} from 'element-plus'
import { computed, markRaw, onBeforeUnmount, onMounted, ref, toRaw, watch } from 'vue'
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
const isFullscreen = ref(false)
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
            icon: { component: markRaw(Menu), props: { color: 'currentColor' } },
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
      panelItemDescriptionLineHeight: '1.55',
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
      panelItemDescriptionLineHeight: '1.55',
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
      panelItemDescriptionLineHeight: '1.55',
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

onMounted(() => {
  syncFullscreenState()
  document.addEventListener('fullscreenchange', syncFullscreenState)
})

onBeforeUnmount(() => {
  document.removeEventListener('fullscreenchange', syncFullscreenState)
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
  const enteringFullscreen = !document.fullscreenElement

  try {
    if (enteringFullscreen) {
      if (!document.documentElement.requestFullscreen) {
        ElMessage.warning('当前浏览器不支持全屏模式')
        return
      }
      await document.documentElement.requestFullscreen()
      return
    }

    if (!document.exitFullscreen) {
      ElMessage.warning('当前浏览器无法退出全屏模式')
      return
    }
    await document.exitFullscreen()
  } catch {
    ElMessage.warning(enteringFullscreen ? '进入全屏失败，请重试' : '退出全屏失败，请重试')
  }
}

function syncFullscreenState() {
  isFullscreen.value = Boolean(document.fullscreenElement)
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
  min-width: 760px;
  min-height: 100%;
  color: #172033;
  font-family: "Segoe UI Variable", "Microsoft YaHei", sans-serif;
  letter-spacing: 0;
  background: #f4f6f9;
}

.header-demo__preview-label {
  height: 30px;
  padding: 0 24px;
  color: #6b778c;
  font-size: 12px;
  line-height: 30px;
  background: #e9edf2;
  border-bottom: 1px solid #d9e0e8;
}

.header-demo__brand,
.header-demo__user-area,
.header-demo__user-button,
.header-demo__menu-content,
.header-demo__group-title,
.header-demo__panel-item,
.header-demo__panel-label,
.header-demo__theme-option {
  display: flex;
  align-items: center;
}

.header-demo__brand {
  gap: 10px;
  color: #ffffff;
  white-space: nowrap;
}

.header-demo__logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  flex: 0 0 auto;
  color: #ffffff;
  font-size: 12px;
  font-weight: 800;
  background: rgb(255 255 255 / 12%);
  border: 1px solid rgb(255 255 255 / 24%);
  border-radius: 6px;
}

.header-demo__brand-name {
  font-size: 16px;
  font-weight: 650;
}

.header-demo__menu-content {
  min-width: 0;
  gap: var(--ga-mega-menu-menu-item-gap, 8px);
}

.header-demo__menu-icon,
.header-demo__panel-icon {
  display: inline-flex;
  flex: 0 0 auto;
}

.header-demo__menu-icon {
  width: 1em;
  height: 1em;
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

.header-demo__open-mark {
  color: currentcolor;
  font-size: 10px;
  opacity: 0.72;
}

.header-demo__active-dot {
  width: 5px;
  height: 5px;
  flex: 0 0 auto;
  background: currentcolor;
  border-radius: 50%;
}

.header-demo__group-title {
  gap: 8px;
}

.header-demo__group-line {
  width: 14px;
  height: 2px;
  flex: 0 0 auto;
  background: currentcolor;
}

.header-demo__panel-item {
  width: 100%;
  gap: var(--ga-mega-menu-panel-item-gap, 12px);
}

.header-demo__panel-copy {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: 4px;
}

.header-demo__panel-label {
  gap: 8px;
}

.header-demo__panel-description {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
}

.header-demo__empty {
  --el-text-color-secondary: var(
    --ga-mega-menu-panel-empty-text-color
  );
}

.header-demo__user-area {
  gap: 10px;
  color: #ffffff;
  white-space: nowrap;
}

.header-demo__header-action {
  color: inherit;
}

.header-demo__header-action:hover,
.header-demo__header-action:focus-visible {
  color: inherit;
  background: rgb(255 255 255 / 12%);
}

.header-demo__user-button {
  gap: 8px;
  min-height: 42px;
  padding: 4px 8px;
  color: inherit;
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
  box-shadow: 0 0 0 2px rgb(166 205 250 / 90%);
}

.header-demo__header--light .header-demo__brand,
.header-demo__header--light .header-demo__user-area {
  color: #263b58;
}

.header-demo__header--light .header-demo__logo {
  color: #244f86;
  background: #edf4fc;
  border-color: #c5d8ee;
}

.header-demo__header--light .header-demo__header-action:hover,
.header-demo__header--light .header-demo__header-action:focus-visible,
.header-demo__header--light .header-demo__user-button:hover,
.header-demo__header--light .header-demo__user-button:focus-visible {
  color: #173f73;
  background: #edf4fc;
}

.header-demo__header--light .header-demo__user-button:focus-visible {
  box-shadow: 0 0 0 2px #6f9bd1;
}

.header-demo__workspace {
  width: min(1180px, calc(100% - 48px));
  margin: 0 auto;
  padding: 36px 0 64px;
}

.header-demo__section {
  padding: 28px 0;
  border-bottom: 1px solid #dce2ea;
}

.header-demo__section:last-child {
  border-bottom: 0;
}

.header-demo__section-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 20px;
}

.header-demo__eyebrow {
  margin: 0 0 5px;
  color: #6c7e96;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
}

.header-demo__section-heading h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 650;
}

.header-demo__control-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px 24px;
}

fieldset.header-demo__control {
  min-inline-size: 0;
  margin: 0;
  padding: 0;
  border: 0;
}

.header-demo__control {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 8px;
  color: #4f5f73;
  font-size: 13px;
}

.header-demo__control > label,
.header-demo__control > legend {
  display: block;
  padding: 0;
  color: inherit;
  font: inherit;
}

.header-demo__control--wide {
  grid-column: span 2;
}

.header-demo__control :deep(.el-input),
.header-demo__control :deep(.el-input-number),
.header-demo__control :deep(.el-select) {
  width: 100%;
}

.header-demo__theme-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.header-demo__theme-option {
  gap: 10px;
  min-width: 150px;
  height: 42px;
  padding: 0 14px;
  color: #33445b;
  font: inherit;
  background: #ffffff;
  border: 1px solid #ccd5e1;
  border-radius: 6px;
  cursor: pointer;
}

.header-demo__theme-option:hover,
.header-demo__theme-option.is-active {
  border-color: #668dbd;
}

.header-demo__theme-option.is-active {
  box-shadow: 0 0 0 2px rgb(102 141 189 / 16%);
}

.header-demo__theme-option:focus-visible {
  border-color: #315c96;
  outline: 2px solid #315c96;
  outline-offset: 2px;
}

.header-demo__theme-swatch {
  width: 22px;
  height: 22px;
  flex: 0 0 auto;
  background: #ffffff;
  border: 1px solid rgb(23 32 51 / 16%);
  border-radius: 4px;
}

.header-demo__status-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1px;
  overflow: hidden;
  margin: 0;
  background: #dce2ea;
  border: 1px solid #dce2ea;
  border-radius: 6px;
}

.header-demo__status-grid > div {
  min-width: 0;
  padding: 16px;
  background: #ffffff;
}

.header-demo__status-grid dt {
  margin-bottom: 8px;
  color: #708096;
  font-size: 12px;
}

.header-demo__status-grid dd {
  overflow: hidden;
  margin: 0;
  color: #263b58;
  font-size: 15px;
  font-weight: 650;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.header-demo__event-list {
  overflow: hidden;
  border: 1px solid #d8e0e9;
  border-radius: 6px;
}

.header-demo__event-row {
  display: grid;
  grid-template-columns: 150px minmax(0, 1fr) 86px;
  gap: 16px;
  min-height: 44px;
  align-items: center;
  padding: 0 14px;
  background: #ffffff;
  border-bottom: 1px solid #e5eaf0;
}

.header-demo__event-row:last-child {
  border-bottom: 0;
}

.header-demo__event-row code {
  color: #315c96;
  font-size: 12px;
}

.header-demo__event-row span {
  overflow: hidden;
  color: #43536a;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.header-demo__event-row time {
  color: #7b8798;
  font-size: 12px;
  text-align: right;
}

.header-demo__event-empty {
  padding: 30px;
  color: #7b8798;
  text-align: center;
  background: #ffffff;
  border: 1px dashed #cbd5e1;
  border-radius: 6px;
}

@media (max-width: 1024px) {
  .header-demo__brand-name,
  .header-demo__open-mark {
    display: none;
  }

  .header-demo__control-grid,
  .header-demo__status-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  :deep(.ga-mega-menu__menu) {
    justify-content: flex-start;
  }
}
</style>
