<template>
  <div class="mega-menu-demo">
    <header class="demo-header" :style="headerStyle">
      <div class="demo-brand">
        <span class="demo-brand__mark">GA</span>
        <strong>运营管理平台</strong>
      </div>

      <GaMegaMenu
        ref="menuRef"
        v-model:active-key="activeKey"
        v-model:open-key="openKey"
        class="demo-navigation"
        :menus="menus"
        :trigger="trigger"
        :open-delay="100"
        :close-delay="180"
        :theme="currentTheme"
        :min-column-width="320"
        :max-column-width="390"
        @select="handleSelect"
        @open="handleOpen"
        @close="handleClose"
      >
        <template #group-title="{ group }">
          <div class="demo-group-title">
            <span>{{ group.title }}</span>
            <small>{{ group.items.length }} 项</small>
          </div>
        </template>
      </GaMegaMenu>

      <div class="demo-user">
        <ElAvatar :size="34">GA</ElAvatar>
        <span>管理员</span>
      </div>
    </header>

    <section class="demo-controls">
      <div class="demo-control">
        <span>触发方式</span>
        <ElSegmented v-model="trigger" :options="triggerOptions" />
      </div>

      <div class="demo-control">
        <span>主题风格</span>
        <ElSegmented v-model="themeName" :options="themeOptions" />
      </div>

      <div class="demo-control demo-control--height">
        <span>父容器高度 {{ headerHeight }}px</span>
        <ElSlider v-model="headerHeight" :min="64" :max="112" :step="4" />
      </div>

      <div class="demo-actions">
        <ElButton @click="menuRef?.open('system')">打开系统管理</ElButton>
        <ElButton @click="menuRef?.toggle('operations')">切换数据运营</ElButton>
        <ElButton @click="menuRef?.close()">关闭面板</ElButton>
      </div>
    </section>

    <section class="demo-result">
      <span>当前菜单</span>
      <strong>{{ activeLabel }}</strong>
      <span class="demo-result__event">{{ eventMessage }}</span>
    </section>
  </div>
</template>

<script setup lang="ts">
import {
  Bell,
  DataAnalysis,
  Document,
  House,
  Lock,
  Monitor,
  Setting,
  Tickets,
  User,
} from '@element-plus/icons-vue'
import {
  ElAvatar,
  ElButton,
  ElSegmented,
  ElSlider,
} from 'element-plus'
import { computed, markRaw, ref } from 'vue'

import { GaMegaMenu } from 'ga-ui-plus/base'
import type {
  GaMegaMenuExpose,
  GaMegaMenuKey,
  GaMegaMenuNavItem,
  GaMegaMenuSelectPayload,
  GaMegaMenuTheme,
  GaMegaMenuTrigger,
} from 'ga-ui-plus/base'

const menus: GaMegaMenuNavItem[] = [
  {
    key: 'home',
    label: '工作台',
    icon: markRaw(House),
  },
  {
    key: 'system',
    label: '系统管理',
    icon: markRaw(Monitor),
    groups: [
      {
        key: 'organization',
        title: '组织与权限',
        items: [
          {
            key: 'users',
            label: '用户管理',
            description: '管理用户账号、状态和基础资料',
            icon: markRaw(User),
          },
          {
            key: 'permissions',
            label: '角色权限',
            description: '配置角色权限和数据访问范围',
            icon: markRaw(Lock),
          },
        ],
      },
            {
        key: 'organization',
        title: '组织与权限',
        items: [
          {
            key: 'users',
            label: '用户管理',
            description: '管理用户账号、状态和基础资料',
            icon: markRaw(User),
          },
          {
            key: 'permissions',
            label: '角色权限',
            description: '配置角色权限和数据访问范围',
            icon: markRaw(Lock),
          },
        ],
      },
            {
        key: 'organization',
        title: '组织与权限',
        items: [
          {
            key: 'users',
            label: '用户管理',
            description: '管理用户账号、状态和基础资料',
            icon: markRaw(User),
          },
          {
            key: 'permissions',
            label: '角色权限',
            description: '配置角色权限和数据访问范围',
            icon: markRaw(Lock),
          },
        ],
      },
            {
        key: 'organization',
        title: '组织与权限',
        items: [
          {
            key: 'users',
            label: '用户管理',
            description: '管理用户账号、状态和基础资料',
            icon: markRaw(User),
          },
          {
            key: 'permissions',
            label: '角色权限角色权限角色权限',
            description: '配置角色权限和数据访问范围配置角色权限和数据访问范围配置角色权限和数据访问范围配置角色权限和数据访问范围',
            icon: markRaw(Lock),
          },
        ],
      },
      {
        key: 'platform',
        title: '平台配置',
        items: [
          {
            key: 'settings',
            label: '系统设置',
            description: '维护系统参数和全局业务规则',
            icon: {
              component: markRaw(Setting),
              props: {
                style: { color: '#d5e6ff' },
              },
            },
          },
          {
            key: 'notifications',
            label: '通知中心',
            description: '配置通知模板和消息发送渠道',
            icon: markRaw(Bell),
          },
          {
            key: 'menu-config',
            label: '菜单配置',
            icon: markRaw(Document),
          },
        ],
      },
    ],
  },
  {
    key: 'operations',
    label: '数据运营中心',
    icon: markRaw(DataAnalysis),
    groups: [
      {
        key: 'analytics',
        title: '数据分析',
        items: [
          {
            key: 'overview',
            label: '经营总览',
            description: '查看业务趋势和核心经营指标',
            icon: markRaw(DataAnalysis),
          },
          {
            key: 'orders',
            label: '订单分析',
            description: '分析订单来源、转化和履约情况',
            icon: markRaw(Tickets),
          },
        ],
      },
    ],
  },
  {
    key: 'docs',
    label: '帮助与文档',
    icon: markRaw(Document),
  },
]

const themes: Record<string, GaMegaMenuTheme> = {
  ocean: {
    backgroundColor: '#2f436b',
    textColor: '#ffffff',
    mutedTextColor: '#b7c4da',
    itemBackgroundColor: '#3d527c',
    itemHoverBackgroundColor: '#465d89',
    itemActiveBackgroundColor: '#315c96',
    itemActiveBorderColor: '#4c78b1',
    panelBackgroundColor: '#2f436b',
    panelBorderColor: '#415a86',
    itemBorderRadius: 14,
    panelItemBorderRadius: 20,
    itemHorizontalPadding: 22,
    itemVerticalSpace: 22,
    iconSize: 25,
    menuFontSize:16,
  },
  forest: {
    backgroundColor: '#163d38',
    textColor: '#f2fffb',
    mutedTextColor: '#a9ccc4',
    itemBackgroundColor: '#24564e',
    itemHoverBackgroundColor: '#2d675d',
    itemActiveBackgroundColor: '#087b62',
    itemActiveBorderColor: '#3ba38c',
    panelBackgroundColor: '#163d38',
    panelBorderColor: '#32675f',
    itemBorderRadius: 8,
    panelItemBorderRadius: 6,
    itemHorizontalPadding: 22,
    itemVerticalSpace: 24,
    iconSize: 24,
    menuFontSize: 18,
  },
  graphite: {
    backgroundColor: '#252a34',
    textColor: '#ffffff',
    mutedTextColor: '#b8bec9',
    itemBackgroundColor: '#363d49',
    itemHoverBackgroundColor: '#444d5c',
    itemActiveBackgroundColor: '#5865f2',
    itemActiveBorderColor: '#7d86f7',
    panelBackgroundColor: '#252a34',
    panelBorderColor: '#49515e',
    itemBorderRadius: 4,
    panelItemBorderRadius: 4,
    itemHorizontalPadding: 20,
    itemVerticalSpace: 20,
    iconSize: 23,
    menuFontSize: 16,
  },
}

const triggerOptions = [
  { label: '点击', value: 'click' },
  { label: '悬停', value: 'hover' },
]

const themeOptions = [
  { label: '深海蓝', value: 'ocean' },
  { label: '森林绿', value: 'forest' },
  { label: '石墨灰', value: 'graphite' },
]

const menuRef = ref<GaMegaMenuExpose>()
const trigger = ref<GaMegaMenuTrigger>('click')
const themeName = ref('ocean')
const headerHeight = ref(64)
const activeKey = ref<GaMegaMenuKey>('overview')
const openKey = ref<GaMegaMenuKey | undefined>()
const eventMessage = ref('等待菜单操作')

const currentTheme = computed(() => themes[themeName.value] ?? themes.ocean)

const headerStyle = computed(() => ({
  height: `${headerHeight.value}px`,
  background: currentTheme.value.backgroundColor,
}))

const allSelectableItems = computed(() => [
  ...menus.filter((menu) => menu.groups === undefined),
  ...menus.flatMap((menu) =>
    menu.groups?.flatMap((group) => group.items) ?? [],
  ),
])

const activeLabel = computed(
  () =>
    allSelectableItems.value.find((item) => item.key === activeKey.value)
      ?.label ?? '未选择',
)

function handleSelect(payload: GaMegaMenuSelectPayload) {
  eventMessage.value = `select: ${payload.key} (${payload.source})`
}

function handleOpen(key: GaMegaMenuKey) {
  eventMessage.value = `open: ${key}`
}

function handleClose(key: GaMegaMenuKey) {
  eventMessage.value = `close: ${key}`
}
</script>

<style scoped lang="scss">
.mega-menu-demo {
  min-height: 560px;
  color: #172033;
  background: #f3f6f8;
}

.demo-header {
  display: grid;
  grid-template-columns: minmax(180px, 1fr) minmax(580px, auto) minmax(180px, 1fr);
  align-items: center;
  padding: 0 28px;
  box-sizing: border-box;
  border-bottom: 1px solid rgb(255 255 255 / 10%);
  transition:
    height 180ms ease,
    background-color 180ms ease;
}

.demo-brand,
.demo-user {
  display: flex;
  align-items: center;
  color: #ffffff;
}

.demo-brand {
  gap: 10px;
  font-size: 17px;
}

.demo-brand__mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  font-size: 13px;
  font-weight: 800;
  background: rgb(255 255 255 / 12%);
  border: 1px solid rgb(255 255 255 / 18%);
  border-radius: 6px;
}

.demo-navigation {
  align-self: stretch;
  width: 100%;
}

.demo-user {
  justify-content: flex-end;
  gap: 9px;
  font-size: 14px;
  font-weight: 600;
}

.demo-controls {
  display: flex;
  align-items: center;
  gap: 28px;
  min-height: 88px;
  padding: 18px 32px;
  box-sizing: border-box;
  background: #ffffff;
  border-bottom: 1px solid #dfe5ec;
}

.demo-control {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #556171;
  font-size: 13px;
  white-space: nowrap;
}

.demo-control--height {
  width: 260px;
}

.demo-control--height :deep(.el-slider) {
  width: 130px;
}

.demo-actions {
  display: flex;
  gap: 8px;
  margin-left: auto;
}

.demo-result {
  display: flex;
  align-items: baseline;
  gap: 14px;
  width: min(1180px, calc(100% - 64px));
  margin: 0 auto;
  padding-top: 260px;
  color: #667180;
}

.demo-result strong {
  color: #20345d;
  font-size: 30px;
}

.demo-result__event {
  margin-left: auto;
  font-family: Consolas, monospace;
  font-size: 12px;
}

.demo-group-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 0 12px;
  color: var(--ga-mega-menu-group-title-color, #b7c4da);
  font-size: 13px;
  font-weight: 700;
}

.demo-group-title small {
  font-size: 11px;
  font-weight: 500;
  opacity: 0.72;
}
</style>
