<template>
  <div class="docs-shell">
    <GaHeader
      class="docs-header"
      aria-label="ga-ui-plus 文档导航"
      :active-key="activeSection"
      :menus="headerMenus"
      :theme="headerTheme"
      background-color="#ffffff"
      @select="handleHeaderSelect"
    >
      <template #left>
        <RouterLink class="docs-brand" to="/guide/usage" aria-label="ga-ui-plus 文档首页">
          <span class="docs-brand__mark">ga</span>
          <span class="docs-brand__name">ga-ui <small>plus</small></span>
        </RouterLink>
      </template>
      <template #right>
        <span class="docs-header__label">组件文档</span>
        <button
          type="button"
          class="docs-mobile-toggle"
          :aria-label="mobileNavOpen ? '关闭目录' : '打开目录'"
          :aria-expanded="mobileNavOpen"
          title="切换目录"
          @click="openMobileNav"
        >
          <ElIcon><Menu /></ElIcon>
        </button>
      </template>
    </GaHeader>

    <div class="docs-body">
      <button
        v-if="mobileNavOpen"
        type="button"
        class="docs-backdrop"
        aria-label="关闭目录"
        @click="mobileNavOpen = false"
      />
      <nav class="docs-sidebar" :class="{ 'is-open': mobileNavOpen }" aria-label="文档目录">
        <GaAsideMenu
          ref="sidebarRef"
          v-model:collapse="collapsed"
          width="260px"
          collapse-width="64px"
          :default-active="route.path"
          :theme="asideTheme"
          @select="handleSidebarSelect"
        >
          <ElMenuItemGroup
            v-for="group in navGroups"
            :key="group.key"
            :title="group.title"
          >
            <ElMenuItem
              v-for="item in group.items"
              :key="item.path"
              :index="item.path"
              :title="item.title"
            >
              <ElIcon><component :is="icons[item.path]" /></ElIcon>
              <template #title>{{ item.title }}</template>
            </ElMenuItem>
          </ElMenuItemGroup>
        </GaAsideMenu>
      </nav>

      <main ref="contentRef" class="docs-content" id="main-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ChatDotRound,
  Document,
  Expand,
  Grid,
  List,
  Menu,
  More,
  Search,
  Top,
} from '@element-plus/icons-vue'
import { ElIcon, ElMenuItem, ElMenuItemGroup } from 'element-plus'
import { GaAsideMenu, GaHeader } from 'ga-ui-plus/business'
import type {
  GaAsideMenuExpose,
  GaAsideMenuTheme,
  GaHeaderProps,
} from 'ga-ui-plus/business'
import type { GaMegaMenuNavItem, GaMegaMenuSelectPayload } from 'ga-ui-plus/base'
import { computed, nextTick, ref, watch } from 'vue'
import type { Component } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { navGroups } from '../nav'

const route = useRoute()
const router = useRouter()
const collapsed = ref(false)
const mobileNavOpen = ref(false)
const contentRef = ref<HTMLElement>()
const sidebarRef = ref<GaAsideMenuExpose>()

const activeSection = computed(() =>
  route.path.startsWith('/guide/') ? 'guide' : 'components',
)

const headerMenus: GaMegaMenuNavItem[] = [
  { key: 'guide', label: '使用指南' },
  { key: 'components', label: '组件' },
]

const headerTheme: NonNullable<GaHeaderProps['theme']> = {
  menuBackgroundColor: '#ffffff',
  menuItemBackgroundColor: 'transparent',
  menuItemTextColor: '#606266',
  menuItemFontSize: 14,
  menuItemFontWeight: 500,
  menuItemHorizontalPadding: 18,
  menuItemBorderRadius: 4,
  menuItemShadow: 'none',
  menuItemActiveShadow: 'none',
  menuItemHoverTextColor: '#409eff',
  menuItemHoverBackgroundColor: '#f5f7fa',
  menuItemActiveTextColor: '#409eff',
  menuItemActiveBackgroundColor: '#ecf5ff',
  menuItemBorderColor: 'transparent',
  menuItemHoverBorderColor: 'transparent',
  menuItemActiveBorderColor: 'transparent',
}

const asideTheme: GaAsideMenuTheme = {
  backgroundColor: '#f7f9fc',
  textColor: '#606266',
  activeTextColor: '#409eff',
  activeBackgroundColor: '#ecf5ff',
  hoverBackgroundColor: '#f0f4fa',
  borderColor: '#dcdfe6',
}

const icons: Record<string, Component> = {
  '/guide/usage': Document,
  '/components/dialog': ChatDotRound,
  '/components/table': Grid,
  '/components/pagination': More,
  '/components/mega-menu': Menu,
  '/components/table-pagination': List,
  '/components/search-bar': Search,
  '/components/aside-menu': Expand,
  '/components/header': Top,
}

function handleHeaderSelect(payload: GaMegaMenuSelectPayload) {
  void router.push(
    payload.key === 'guide' ? '/guide/usage' : '/components/dialog',
  )
}

function handleSidebarSelect(path: string) {
  void router.push(path)
}

function openMobileNav() {
  if (!mobileNavOpen.value) collapsed.value = false
  mobileNavOpen.value = !mobileNavOpen.value
}

watch(
  () => route.path,
  async () => {
    mobileNavOpen.value = false
    await nextTick()
    sidebarRef.value?.menuRef?.updateActiveIndex(route.path)
    contentRef.value?.scrollTo({ top: 0 })
  },
)
</script>
