<template>
  <ElAside
    v-bind="$attrs"
    :width="currentWidth"
    class="ga-aside-menu"
    :style="{ '--ga-aside-menu-width': props.width }"
  >
    <div v-if="slots.header" class="ga-aside-menu__header">
      <slot
        name="header"
        :collapse="currentCollapse"
        :active="currentActive"
      />
    </div>

    <ElScrollbar class="ga-aside-menu__body">
      <ElMenu
        ref="menuRef"
        v-bind="menuProps"
        class="ga-aside-menu__menu"
        mode="vertical"
        :collapse="currentCollapse"
        :default-active="currentActive"
        @select="handleSelect"
        @open="handleOpen"
        @close="handleClose"
      >
        <GaMenuSlotTree
          v-if="slots.default"
          :active="currentActive"
          :popper-class-fallback="props.popperClass"
        >
          <slot />
        </GaMenuSlotTree>
        <GaMenuTree
          v-else-if="normalizedItems.length"
          :nodes="normalizedItems"
          :active="currentActive"
          :popper-class-fallback="props.popperClass"
        />
      </ElMenu>
    </ElScrollbar>

    <div v-if="slots.footer" class="ga-aside-menu__footer">
      <slot
        name="footer"
        :collapse="currentCollapse"
        :active="currentActive"
      />
    </div>

    <div class="ga-aside-menu__trigger">
      <slot
        name="trigger"
        :collapse="currentCollapse"
        :active="currentActive"
        :toggle="toggleCollapse"
      >
        <button
          type="button"
          class="ga-aside-menu__trigger-btn"
          :aria-label="currentCollapse ? '展开菜单' : '折叠菜单'"
          :title="currentCollapse ? '展开菜单' : '折叠菜单'"
          @click="toggleCollapse"
        >
          <svg
            v-if="currentCollapse"
            aria-hidden="true"
            class="ga-aside-menu__trigger-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path
              d="M4 6a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2l0 -12"
            />
            <path d="M15 4v16" />
            <path d="M9 10l2 2l-2 2" />
          </svg>

          <svg
            v-else
            aria-hidden="true"
            class="ga-aside-menu__trigger-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path
              d="M4 6a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2l0 -12"
            />
            <path d="M9 4v16" />
            <path d="M15 10l-2 2l2 2" />
          </svg>

          <span v-if="!currentCollapse">折叠菜单</span>
        </button>
      </slot>
    </div>
  </ElAside>
</template>

<script setup lang="ts">
import { ElAside, ElMenu, ElScrollbar } from 'element-plus'
import type { MenuInstance, MenuItemClicked } from 'element-plus'
import { computed, ref, useSlots, watchEffect } from 'vue'
import type { Slots } from 'vue'

import type { GaAsideMenuEmits, GaAsideMenuProps } from '../types/index'
import {
  getAsideMenuConfigurationWarnings,
  normalizeAsideMenuNodes,
} from './menu-items'
import GaMenuSlotTree from './menu-slot-tree'
import GaMenuTree from './menu-tree.vue'
import { useAsideMenuState } from './use-aside-menu-state'

defineOptions({
  name: 'GaAsideMenu',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<GaAsideMenuProps>(), {
  collapse: false,
  width: '240px',
  items: () => [],
})

const emit = defineEmits<GaAsideMenuEmits>()
const slots: Slots = useSlots()
const menuRef = ref<MenuInstance>()

const {
  currentActive,
  currentCollapse,
  selectActive,
  toggleCollapse,
} = useAsideMenuState({
  props,
  menuRef,
  onCollapseUpdate: (value) => {
    emit('update:collapse', value)
  },
  onToggle: (value) => {
    emit('toggle', value)
  },
  onActiveUpdate: (value) => {
    emit('update:active', value)
  },
})

const currentWidth = computed(() =>
  currentCollapse.value ? 'auto' : props.width,
)

const normalizedItems = computed(() => normalizeAsideMenuNodes(props.items))

const menuProps = computed(() => {
  const {
    active,
    collapse,
    defaultActive,
    items,
    width,
    ...elMenuProps
  } = props
  return elMenuProps
})

const warnedMessages = new Set<string>()

watchEffect(() => {
  if (!import.meta.env.DEV) return

  const warnings = getAsideMenuConfigurationWarnings(
    props.items,
    Boolean(slots.default),
  )

  warnings.forEach((message) => {
    if (warnedMessages.has(message)) return
    warnedMessages.add(message)
    console.warn(`[GaAsideMenu] ${message}`)
  })
})

const handleSelect = (
  index: string,
  indexPath: string[],
  item: MenuItemClicked,
  routerResult?: Promise<unknown>,
) => {
  selectActive(index)
  emit('select', index, indexPath, item, routerResult)
}

const handleOpen = (index: string, indexPath: string[]) => {
  emit('open', index, indexPath)
}

const handleClose = (index: string, indexPath: string[]) => {
  emit('close', index, indexPath)
}

defineExpose({
  menuRef,
  toggle: toggleCollapse,
})
</script>

<style lang="scss">
@use '../style/index.scss';
</style>
