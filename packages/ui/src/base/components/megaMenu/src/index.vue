<template>
  <nav
    ref="rootRef"
    class="ga-mega-menu"
    :style="rootStyle"
    :aria-label="props.ariaLabel"
    @mouseenter="clearCloseTimer"
    @mouseleave="handleRootMouseLeave"
    @keydown.esc="close"
  >
    <div class="ga-mega-menu__menu">
      <button
        v-for="menu in props.menus"
        :key="menu.key"
        type="button"
        class="ga-mega-menu__nav-item"
        :class="{
          'is-active': activeMenuKey === menu.key,
          'is-panel-open': currentOpenKey === menu.key,
        }"
        :data-menu-key="String(menu.key)"
        :disabled="menu.disabled"
        :aria-current="activeMenuKey === menu.key ? 'page' : undefined"
        :aria-controls="hasPanel(menu) ? panelId(menu) : undefined"
        :aria-expanded="hasPanel(menu) ? currentOpenKey === menu.key : undefined"
        :aria-haspopup="hasPanel(menu) ? 'true' : undefined"
        @click="handleTopMenuClick($event, menu)"
        @focus="handleMenuFocus(menu)"
        @mouseenter="handleMenuMouseEnter(menu)"
      >
        <slot
          name="menu-item"
          :menu="menu"
          :active="activeMenuKey === menu.key"
          :open="currentOpenKey === menu.key"
        >
          <span v-if="menu.icon" class="ga-mega-menu__icon" aria-hidden="true">
            <component
              :is="resolveIconComponent(menu.icon)"
              v-bind="resolveIconProps(menu.icon)"
            />
          </span>
          <span class="ga-mega-menu__nav-label">{{ menu.label }}</span>
        </slot>
      </button>
    </div>

    <Teleport to="body">
      <Transition name="ga-mega-menu-panel">
        <section
          v-if="openMenu"
          :id="panelId(openMenu)"
          ref="panelRef"
          class="ga-mega-menu__panel"
          :style="panelStyle"
          :aria-label="openMenu.label"
          @mouseenter="clearCloseTimer"
          @mouseleave="handlePanelMouseLeave"
          @keydown.esc="close"
        >
          <ElScrollbar :max-height="scrollbarMaxHeight">
            <div v-if="panelGroups.length" class="ga-mega-menu__grid">
              <section
                v-for="group in panelGroups"
                :key="group.key"
                class="ga-mega-menu__group"
                :aria-label="group.title"
              >
                <slot name="group-title" :menu="openMenu" :group="group">
                  <h3 v-if="group.title" class="ga-mega-menu__group-title">
                    {{ group.title }}
                  </h3>
                </slot>

                <ul class="ga-mega-menu__list">
                  <li v-for="item in group.items" :key="item.key">
                    <button
                      type="button"
                      class="ga-mega-menu__item"
                      :class="{
                        'is-active': currentActiveKey === item.key,
                        'is-disabled': item.disabled,
                        'is-label-only': !hasDescription(item),
                      }"
                      :data-item-key="String(item.key)"
                      :disabled="item.disabled"
                      @click="
                        handlePanelItemClick($event, item, group, openMenu)
                      "
                    >
                      <slot
                        name="panel-item"
                        :menu="openMenu"
                        :group="group"
                        :item="item"
                        :active="currentActiveKey === item.key"
                      >
                        <span
                          v-if="item.icon"
                          class="ga-mega-menu__item-icon"
                          aria-hidden="true"
                        >
                          <component
                            :is="resolveIconComponent(item.icon)"
                            v-bind="resolveIconProps(item.icon)"
                          />
                        </span>

                        <span class="ga-mega-menu__item-content">
                          <span class="ga-mega-menu__item-label">
                            {{ item.label }}
                          </span>
                          <span
                            v-if="hasDescription(item)"
                            class="ga-mega-menu__item-description"
                          >
                            {{ item.description }}
                          </span>
                        </span>
                      </slot>
                    </button>
                  </li>
                </ul>
              </section>
            </div>

            <div v-else class="ga-mega-menu__empty">
              <slot name="empty" :menu="openMenu">暂无菜单</slot>
            </div>
          </ElScrollbar>
        </section>
      </Transition>
    </Teleport>
  </nav>
</template>

<script setup lang="ts">
import { ElScrollbar } from 'element-plus'
import {
  computed,
  getCurrentInstance,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  toRaw,
  watch,
} from 'vue'
import type { Component, CSSProperties } from 'vue'

import type {
  GaMegaMenuEmits,
  GaMegaMenuEmptySlotProps,
  GaMegaMenuExpose,
  GaMegaMenuGroup,
  GaMegaMenuGroupTitleSlotProps,
  GaMegaMenuIcon,
  GaMegaMenuIconConfig,
  GaMegaMenuItem,
  GaMegaMenuKey,
  GaMegaMenuMenuItemSlotProps,
  GaMegaMenuNavItem,
  GaMegaMenuPanelItemSlotProps,
  GaMegaMenuProps,
  GaMegaMenuTheme,
} from '../types/index'

defineOptions({
  name: 'GaMegaMenu',
})

defineSlots<{
  'menu-item'?: (scope: GaMegaMenuMenuItemSlotProps) => unknown
  'group-title'?: (scope: GaMegaMenuGroupTitleSlotProps) => unknown
  'panel-item'?: (scope: GaMegaMenuPanelItemSlotProps) => unknown
  empty?: (scope: GaMegaMenuEmptySlotProps) => unknown
}>()

const props = withDefaults(defineProps<GaMegaMenuProps>(), {
  menus: () => [],
  activeKey: undefined,
  openKey: undefined,
  trigger: 'click',
  openDelay: 100,
  closeDelay: 180,
  minColumnWidth: 240,
  maxColumnWidth: 420,
  maxHeight: 'auto',
  closeOnSelect: true,
  theme: () => ({}),
  ariaLabel: '大型菜单导航',
})

const emit = defineEmits<GaMegaMenuEmits>()
const instance = getCurrentInstance()
const rootRef = ref<HTMLElement>()
const panelRef = ref<HTMLElement>()
const internalActiveKey = ref<GaMegaMenuKey | undefined>(props.activeKey)
const internalOpenKey = ref<GaMegaMenuKey | undefined>(props.openKey)
const panelTop = ref(0)
const componentId = `ga-mega-menu-${instance?.uid ?? 0}`

let openTimer: ReturnType<typeof setTimeout> | undefined
let closeTimer: ReturnType<typeof setTimeout> | undefined
let resizeObserver: ResizeObserver | undefined

const defaultTheme: Required<GaMegaMenuTheme> = {
  menuBackgroundColor: '#2f436b',
  menuGap: 8,
  menuItemTextColor: '#ffffff',
  menuItemBackgroundColor: '#3d527c',
  menuItemBorderColor: 'transparent',
  menuItemHoverTextColor: '#ffffff',
  menuItemHoverBackgroundColor: '#465d89',
  menuItemHoverBorderColor: 'rgb(255 255 255 / 12%)',
  menuItemActiveTextColor: '#ffffff',
  menuItemActiveBackgroundColor: '#315c96',
  menuItemActiveBorderColor: '#4c78b1',
  menuItemDisabledTextColor: 'rgb(255 255 255 / 45%)',
  menuItemDisabledBackgroundColor: 'rgb(255 255 255 / 8%)',
  menuItemDisabledBorderColor: 'transparent',
  menuItemFocusOutlineColor: '#8db7f0',
  menuItemFontSize: 20,
  menuItemFontWeight: 700,
  menuItemIconSize: 26,
  menuItemGap: 10,
  menuItemHorizontalPadding: 24,
  menuItemVerticalSpace: 32,
  menuItemBorderRadius: 14,
  menuItemShadow: '0 1px 1px rgb(15 31 58 / 18%)',
  menuItemActiveShadow:
    'inset 0 1px 0 rgb(255 255 255 / 6%), 0 1px 2px rgb(13 29 55 / 22%)',
  panelBackgroundColor: '#2f436b',
  panelBorderColor: '#415a86',
  panelTopBorderColor: 'rgb(255 255 255 / 8%)',
  panelShadow: '0 18px 40px rgb(15 31 58 / 28%)',
  panelPadding: 24,
  panelGap: 24,
  panelGroupTitleColor: '#b7c4da',
  panelGroupTitleFontSize: 13,
  panelGroupTitleFontWeight: 600,
  panelGroupTitleMarginBottom: 10,
  panelGroupTitleHorizontalPadding: 12,
  panelItemTextColor: '#ffffff',
  panelItemBackgroundColor: '#3d527c',
  panelItemBorderColor: 'transparent',
  panelItemHoverTextColor: '#ffffff',
  panelItemHoverBackgroundColor: '#465d89',
  panelItemHoverBorderColor: 'rgb(255 255 255 / 12%)',
  panelItemActiveTextColor: '#ffffff',
  panelItemActiveBackgroundColor: '#315c96',
  panelItemActiveBorderColor: '#4c78b1',
  panelItemDisabledTextColor: 'rgb(255 255 255 / 42%)',
  panelItemDisabledBackgroundColor: 'rgb(255 255 255 / 6%)',
  panelItemDisabledBorderColor: 'transparent',
  panelItemFocusOutlineColor: '#8db7f0',
  panelItemBorderRadius: 10,
  panelItemMinHeight: 64,
  panelItemPadding: 12,
  panelItemGap: 12,
  panelItemListGap: 8,
  panelItemLabelFontSize: 14,
  panelItemLabelFontWeight: 700,
  panelItemDescriptionColor: '#b7c4da',
  panelItemDescriptionFontSize: 12,
  panelItemDescriptionLineHeight: 18,
  panelItemIconColor: '#ffffff',
  panelItemIconSize: 20,
  panelItemIconBoxSize: 38,
  panelItemIconBackgroundColor: 'rgb(255 255 255 / 8%)',
  panelItemIconBorderRadius: 8,
  panelEmptyTextColor: '#b7c4da',
  panelEmptyPadding: '48px 24px',
}

const currentActiveKey = computed(() =>
  isControlled('activeKey') ? props.activeKey : internalActiveKey.value,
)
const currentOpenKey = computed(() =>
  isControlled('openKey') ? props.openKey : internalOpenKey.value,
)

const openMenu = computed(() =>
  props.menus.find(
    (menu) => menu.key === currentOpenKey.value && hasPanel(menu),
  ),
)

const panelGroups = computed(() => openMenu.value?.groups ?? [])

const scrollbarMaxHeight = computed(() =>
  props.maxHeight === 'auto' ? undefined : props.maxHeight,
)

const activeMenuKey = computed(() => {
  const directMenu = props.menus.find(
    (menu) => menu.key === currentActiveKey.value,
  )
  if (directMenu) return directMenu.key

  return props.menus.find((menu) =>
    menu.groups?.some((group) =>
      group.items.some((item) => item.key === currentActiveKey.value),
    ),
  )?.key
})

const currentTheme = computed<Required<GaMegaMenuTheme>>(() => ({
  ...defaultTheme,
  ...props.theme,
}))

const themeStyle = computed<CSSProperties>(() =>
  createThemeStyle(currentTheme.value),
)

const columnStyle = computed<CSSProperties>(() => {
  const minColumnWidth = normalizePositiveNumber(props.minColumnWidth, 240)
  const maxColumnWidth = Math.max(
    normalizePositiveNumber(props.maxColumnWidth, 420),
    minColumnWidth,
  )

  return {
    '--ga-mega-menu-min-column-width': `${minColumnWidth}px`,
    '--ga-mega-menu-max-column-width': `${maxColumnWidth}px`,
  }
})

const rootStyle = computed<CSSProperties>(() => ({
  ...themeStyle.value,
  ...columnStyle.value,
}))

const panelStyle = computed<CSSProperties>(() => ({
  ...themeStyle.value,
  ...columnStyle.value,
  '--ga-mega-menu-panel-top': `${panelTop.value}px`,
}))

watch(
  () => props.activeKey,
  (value) => {
    internalActiveKey.value = value
  },
)

watch(
  () => props.openKey,
  (value) => {
    internalOpenKey.value = value
  },
)

watch(currentOpenKey, (value, previousValue) => {
  void nextTick(updatePanelPosition)

  const previousMenu = menuByKey(previousValue)
  if (previousValue !== undefined && previousMenu) {
    emit('close', previousValue, previousMenu)
  }

  const nextMenu = menuByKey(value)
  if (value !== undefined && nextMenu) emit('open', value, nextMenu)
})

watch(() => props.trigger, clearTimers)

function hasPanel(menu: GaMegaMenuNavItem) {
  return menu.groups !== undefined
}

function hasDescription(item: GaMegaMenuItem) {
  return Boolean(item.description?.trim())
}

function panelId(menu: GaMegaMenuNavItem) {
  const key = String(menu.key).replace(/[^a-zA-Z0-9_-]/g, '-')
  return `${componentId}-panel-${key}`
}

function formatSize(value: string | number) {
  return typeof value === 'number' ? `${value}px` : value
}

function normalizePositiveNumber(value: number, fallback: number) {
  return Number.isFinite(value) ? Math.max(value, 1) : fallback
}

function optionalSize(value: string | number | undefined) {
  return value === undefined ? undefined : formatSize(value)
}

function isControlled(name: 'activeKey' | 'openKey') {
  const vnodeProps = instance?.vnode.props
  if (!vnodeProps) return false

  const kebabName = name.replace(/[A-Z]/g, (letter) =>
    `-${letter.toLowerCase()}`,
  )

  return [name, kebabName].some((key) =>
    Object.prototype.hasOwnProperty.call(vnodeProps, key),
  )
}

function createThemeStyle(theme: GaMegaMenuTheme): CSSProperties {
  return {
    '--ga-mega-menu-menu-bg-color': theme.menuBackgroundColor,
    '--ga-mega-menu-menu-gap': optionalSize(theme.menuGap),
    '--ga-mega-menu-menu-item-text-color': theme.menuItemTextColor,
    '--ga-mega-menu-menu-item-bg-color': theme.menuItemBackgroundColor,
    '--ga-mega-menu-menu-item-border-color': theme.menuItemBorderColor,
    '--ga-mega-menu-menu-item-hover-text-color': theme.menuItemHoverTextColor,
    '--ga-mega-menu-menu-item-hover-bg-color':
      theme.menuItemHoverBackgroundColor,
    '--ga-mega-menu-menu-item-hover-border-color':
      theme.menuItemHoverBorderColor,
    '--ga-mega-menu-menu-item-active-text-color':
      theme.menuItemActiveTextColor,
    '--ga-mega-menu-menu-item-active-bg-color':
      theme.menuItemActiveBackgroundColor,
    '--ga-mega-menu-menu-item-active-border-color':
      theme.menuItemActiveBorderColor,
    '--ga-mega-menu-menu-item-disabled-text-color':
      theme.menuItemDisabledTextColor,
    '--ga-mega-menu-menu-item-disabled-bg-color':
      theme.menuItemDisabledBackgroundColor,
    '--ga-mega-menu-menu-item-disabled-border-color':
      theme.menuItemDisabledBorderColor,
    '--ga-mega-menu-menu-item-focus-outline-color':
      theme.menuItemFocusOutlineColor,
    '--ga-mega-menu-menu-item-font-size': optionalSize(theme.menuItemFontSize),
    '--ga-mega-menu-menu-item-font-weight': theme.menuItemFontWeight,
    '--ga-mega-menu-menu-item-icon-size': optionalSize(theme.menuItemIconSize),
    '--ga-mega-menu-menu-item-gap': optionalSize(theme.menuItemGap),
    '--ga-mega-menu-menu-item-horizontal-padding': optionalSize(
      theme.menuItemHorizontalPadding,
    ),
    '--ga-mega-menu-menu-item-vertical-space': optionalSize(
      theme.menuItemVerticalSpace,
    ),
    '--ga-mega-menu-menu-item-radius': optionalSize(
      theme.menuItemBorderRadius,
    ),
    '--ga-mega-menu-menu-item-shadow': theme.menuItemShadow,
    '--ga-mega-menu-menu-item-active-shadow': theme.menuItemActiveShadow,
    '--ga-mega-menu-panel-bg-color': theme.panelBackgroundColor,
    '--ga-mega-menu-panel-border-color': theme.panelBorderColor,
    '--ga-mega-menu-panel-top-border-color': theme.panelTopBorderColor,
    '--ga-mega-menu-panel-shadow': theme.panelShadow,
    '--ga-mega-menu-panel-padding': optionalSize(theme.panelPadding),
    '--ga-mega-menu-panel-gap': optionalSize(theme.panelGap),
    '--ga-mega-menu-panel-group-title-color': theme.panelGroupTitleColor,
    '--ga-mega-menu-panel-group-title-font-size': optionalSize(
      theme.panelGroupTitleFontSize,
    ),
    '--ga-mega-menu-panel-group-title-font-weight':
      theme.panelGroupTitleFontWeight,
    '--ga-mega-menu-panel-group-title-margin-bottom': optionalSize(
      theme.panelGroupTitleMarginBottom,
    ),
    '--ga-mega-menu-panel-group-title-horizontal-padding': optionalSize(
      theme.panelGroupTitleHorizontalPadding,
    ),
    '--ga-mega-menu-panel-item-text-color': theme.panelItemTextColor,
    '--ga-mega-menu-panel-item-bg-color': theme.panelItemBackgroundColor,
    '--ga-mega-menu-panel-item-border-color': theme.panelItemBorderColor,
    '--ga-mega-menu-panel-item-hover-text-color':
      theme.panelItemHoverTextColor,
    '--ga-mega-menu-panel-item-hover-bg-color':
      theme.panelItemHoverBackgroundColor,
    '--ga-mega-menu-panel-item-hover-border-color':
      theme.panelItemHoverBorderColor,
    '--ga-mega-menu-panel-item-active-text-color':
      theme.panelItemActiveTextColor,
    '--ga-mega-menu-panel-item-active-bg-color':
      theme.panelItemActiveBackgroundColor,
    '--ga-mega-menu-panel-item-active-border-color':
      theme.panelItemActiveBorderColor,
    '--ga-mega-menu-panel-item-disabled-text-color':
      theme.panelItemDisabledTextColor,
    '--ga-mega-menu-panel-item-disabled-bg-color':
      theme.panelItemDisabledBackgroundColor,
    '--ga-mega-menu-panel-item-disabled-border-color':
      theme.panelItemDisabledBorderColor,
    '--ga-mega-menu-panel-item-focus-outline-color':
      theme.panelItemFocusOutlineColor,
    '--ga-mega-menu-panel-item-radius': optionalSize(
      theme.panelItemBorderRadius,
    ),
    '--ga-mega-menu-panel-item-min-height': optionalSize(
      theme.panelItemMinHeight,
    ),
    '--ga-mega-menu-panel-item-padding': optionalSize(theme.panelItemPadding),
    '--ga-mega-menu-panel-item-gap': optionalSize(theme.panelItemGap),
    '--ga-mega-menu-panel-item-list-gap': optionalSize(theme.panelItemListGap),
    '--ga-mega-menu-panel-item-label-font-size': optionalSize(
      theme.panelItemLabelFontSize,
    ),
    '--ga-mega-menu-panel-item-label-font-weight':
      theme.panelItemLabelFontWeight,
    '--ga-mega-menu-panel-item-description-color':
      theme.panelItemDescriptionColor,
    '--ga-mega-menu-panel-item-description-font-size': optionalSize(
      theme.panelItemDescriptionFontSize,
    ),
    '--ga-mega-menu-panel-item-description-line-height': optionalSize(
      theme.panelItemDescriptionLineHeight,
    ),
    '--ga-mega-menu-panel-item-icon-color': theme.panelItemIconColor,
    '--ga-mega-menu-panel-item-icon-size': optionalSize(
      theme.panelItemIconSize,
    ),
    '--ga-mega-menu-panel-item-icon-box-size': optionalSize(
      theme.panelItemIconBoxSize,
    ),
    '--ga-mega-menu-panel-item-icon-bg-color':
      theme.panelItemIconBackgroundColor,
    '--ga-mega-menu-panel-item-icon-radius': optionalSize(
      theme.panelItemIconBorderRadius,
    ),
    '--ga-mega-menu-panel-empty-text-color': theme.panelEmptyTextColor,
    '--ga-mega-menu-panel-empty-padding': optionalSize(
      theme.panelEmptyPadding,
    ),
  }
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

function menuByKey(key: GaMegaMenuKey | undefined) {
  return props.menus.find((menu) => menu.key === key)
}

function setActiveKey(key: GaMegaMenuKey) {
  if (currentActiveKey.value === key) return
  if (!isControlled('activeKey')) internalActiveKey.value = key
  emit('update:activeKey', key)
}

function setOpenKey(key: GaMegaMenuKey | undefined) {
  if (currentOpenKey.value === key) return
  if (!isControlled('openKey')) internalOpenKey.value = key
  emit('update:openKey', key)
}

function clearOpenTimer() {
  if (openTimer === undefined) return
  clearTimeout(openTimer)
  openTimer = undefined
}

function clearCloseTimer() {
  if (closeTimer === undefined) return
  clearTimeout(closeTimer)
  closeTimer = undefined
}

function clearTimers() {
  clearOpenTimer()
  clearCloseTimer()
}

function scheduleOpen(menu: GaMegaMenuNavItem) {
  clearTimers()
  const menuKey = menu.key
  openTimer = setTimeout(() => {
    const latestMenu = menuByKey(menuKey)
    if (
      props.trigger === 'hover' &&
      latestMenu &&
      !latestMenu.disabled &&
      hasPanel(latestMenu)
    ) {
      setOpenKey(latestMenu.key)
    }
    openTimer = undefined
  }, Math.max(props.openDelay, 0))
}

function scheduleClose() {
  clearTimers()
  closeTimer = setTimeout(() => {
    if (props.trigger === 'hover') setOpenKey(undefined)
    closeTimer = undefined
  }, Math.max(props.closeDelay, 0))
}

function handleTopMenuClick(event: MouseEvent, menu: GaMegaMenuNavItem) {
  if (menu.disabled) return
  clearTimers()

  if (hasPanel(menu)) {
    if (props.trigger === 'click') toggle(menu.key)
    else open(menu.key)
    return
  }

  setActiveKey(menu.key)
  setOpenKey(undefined)
  emit('select', {
    key: menu.key,
    source: 'menu',
    menu,
    nativeEvent: event,
  })
}

function handleMenuMouseEnter(menu: GaMegaMenuNavItem) {
  if (props.trigger !== 'hover' || menu.disabled) return
  if (hasPanel(menu)) scheduleOpen(menu)
  else scheduleClose()
}

function handleMenuFocus(menu: GaMegaMenuNavItem) {
  if (props.trigger !== 'hover' || menu.disabled || !hasPanel(menu)) return
  clearTimers()
  setOpenKey(menu.key)
}

function handleRootMouseLeave() {
  if (props.trigger === 'hover') scheduleClose()
}

function handlePanelMouseLeave() {
  if (props.trigger === 'hover') scheduleClose()
}

function handlePanelItemClick(
  event: MouseEvent,
  item: GaMegaMenuItem,
  group: GaMegaMenuGroup,
  menu: GaMegaMenuNavItem,
) {
  if (item.disabled) return

  setActiveKey(item.key)
  const payload = {
    key: item.key,
    source: 'panel',
    menu,
    group,
    item,
    nativeEvent: event,
  } as const

  if (props.closeOnSelect && currentOpenKey.value !== undefined) {
    setOpenKey(undefined)
    void nextTick(() => emit('select', payload))
    return
  }

  emit('select', payload)
}

function open(key: GaMegaMenuKey) {
  const menu = menuByKey(key)
  if (!menu || menu.disabled || !hasPanel(menu)) return
  clearTimers()
  setOpenKey(key)
}

function close() {
  clearTimers()
  setOpenKey(undefined)
}

function toggle(key: GaMegaMenuKey) {
  if (currentOpenKey.value === key) close()
  else open(key)
}

function updatePanelPosition() {
  const bottom = rootRef.value?.getBoundingClientRect().bottom ?? 0
  panelTop.value = Number.isFinite(bottom) ? Math.max(bottom, 0) : 0
}

function handleDocumentPointerDown(event: PointerEvent) {
  const target = event.target
  if (
    !(target instanceof Node) ||
    rootRef.value?.contains(target) ||
    panelRef.value?.contains(target)
  ) {
    return
  }
  close()
}

onMounted(() => {
  updatePanelPosition()
  window.addEventListener('resize', updatePanelPosition)
  window.addEventListener('scroll', updatePanelPosition, true)
  document.addEventListener('pointerdown', handleDocumentPointerDown)

  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(updatePanelPosition)
    if (rootRef.value) resizeObserver.observe(rootRef.value)
    if (rootRef.value?.parentElement) {
      resizeObserver.observe(rootRef.value.parentElement)
    }
  }
})

onBeforeUnmount(() => {
  clearTimers()
  resizeObserver?.disconnect()
  window.removeEventListener('resize', updatePanelPosition)
  window.removeEventListener('scroll', updatePanelPosition, true)
  document.removeEventListener('pointerdown', handleDocumentPointerDown)
})

defineExpose<GaMegaMenuExpose>({
  open,
  close,
  toggle,
})
</script>

<style lang="scss">
@use '../style/index.scss';
</style>
