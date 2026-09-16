<script setup lang="ts">
import { DataAnalysis, House, Setting, User } from '@element-plus/icons-vue'
import { computed, markRaw, ref } from 'vue'
import type {
  GaMegaMenuKey,
  GaMegaMenuNavItem,
  GaMegaMenuSelectPayload,
  GaMegaMenuTheme,
  GaMegaMenuTrigger,
} from 'ga-ui-plus/base'

const trigger = ref<GaMegaMenuTrigger>('click')
const activeKey = ref<GaMegaMenuKey>('home')
const openKey = ref<GaMegaMenuKey>()
const lastEvent = ref('等待选择')

const theme: GaMegaMenuTheme = {
  menuItemFontSize: 15,
  menuItemFontWeight: 650,
  menuItemIconSize: 20,
  menuItemGap: 7,
  menuItemHorizontalPadding: 14,
  menuItemVerticalSpace: 18,
  menuItemBorderRadius: 7,
}

const menus: GaMegaMenuNavItem[] = [
  { key: 'home', label: '工作台', icon: markRaw(House) },
  {
    key: 'system',
    label: '系统管理',
    icon: markRaw(Setting),
    groups: [
      {
        key: 'accounts',
        title: '账号与权限',
        items: [
          {
            key: 'users',
            label: '用户管理',
            description: '维护用户资料与启停状态',
            icon: markRaw(User),
          },
          {
            key: 'roles',
            label: '角色权限',
            description: '配置角色和数据权限',
            icon: markRaw(Setting),
          },
        ],
      },
    ],
  },
  {
    key: 'analysis',
    label: '数据中心',
    icon: markRaw(DataAnalysis),
    groups: [
      {
        key: 'reports',
        title: '经营分析',
        items: [
          {
            key: 'overview',
            label: '经营总览',
            description: '查看核心业务指标',
            icon: markRaw(DataAnalysis),
          },
        ],
      },
    ],
  },
]

const activeLabel = computed(() => {
  for (const menu of menus) {
    if (menu.key === activeKey.value) return menu.label
    for (const group of menu.groups ?? []) {
      const item = group.items.find((entry) => entry.key === activeKey.value)
      if (item) return item.label
    }
  }
  return '未选择'
})

function handleSelect(payload: GaMegaMenuSelectPayload) {
  lastEvent.value = `select: ${payload.key} (${payload.source})`
}
</script>

<template>
  <div class="mega-demo">
    <div class="mega-demo__toolbar">
      <span>触发方式</span>
      <ElRadioGroup v-model="trigger" size="small">
        <ElRadioButton value="click">点击</ElRadioButton>
        <ElRadioButton value="hover">悬停</ElRadioButton>
      </ElRadioGroup>
    </div>

    <div class="mega-demo__nav">
      <strong class="mega-demo__brand">GA Console</strong>
      <GaMegaMenu
        v-model:active-key="activeKey"
        v-model:open-key="openKey"
        :menus="menus"
        :trigger="trigger"
        :theme="theme"
        :min-column-width="220"
        :max-column-width="320"
        @select="handleSelect"
      />
    </div>

    <div class="mega-demo__result">
      当前选择：<strong>{{ activeLabel }}</strong>
      <span>{{ lastEvent }}</span>
    </div>
  </div>
</template>

<style scoped>
.mega-demo {
  width: 100%;
  min-width: 0;
  border: 1px solid #dfe5ec;
}

.mega-demo__toolbar,
.mega-demo__result {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 46px;
  padding: 0 16px;
  color: #5b6675;
  font-size: 13px;
}

.mega-demo__nav {
  display: flex;
  align-items: stretch;
  height: 68px;
  background: #2f436b;
}

.mega-demo__brand {
  display: flex;
  align-items: center;
  min-width: 116px;
  padding: 0 14px;
  color: #fff;
}

.mega-demo__nav :deep(.ga-mega-menu) {
  flex: 1;
}

.mega-demo__result span {
  margin-left: auto;
}
</style>
