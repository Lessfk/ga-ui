<template>
  <ElAside
    v-bind="$attrs"
    class="ga-aside-menu"
    :class="{ 'is-collapse': currentCollapse }"
    :style="themeStyle"
    :width="currentWidth"
  >
    <div v-if="slots.header" class="ga-aside-menu__header">
      <slot name="header" :collapse="currentCollapse" />
    </div>

    <ElScrollbar class="ga-aside-menu__scrollbar">
      <ElMenu
        ref="menuRef"
        v-bind="menuProps"
        class="ga-aside-menu__menu"
        mode="vertical"
        :collapse="currentCollapse"
        :popper-class="menuPopperClass"
        :popper-style="menuPopperStyle"
        @select="handleSelect"
        @open="handleOpen"
        @close="handleClose"
      >
        <slot />
      </ElMenu>
    </ElScrollbar>

    <div v-if="slots.footer" class="ga-aside-menu__footer">
      <slot name="footer" :collapse="currentCollapse" />
    </div>

    <div class="ga-aside-menu__collapse">
      <slot name="collapse" :collapse="currentCollapse" :toggle="toggle">
        <button
          type="button"
          class="ga-aside-menu__collapse-button"
          :aria-label="currentCollapse ? '展开菜单' : '折叠菜单'"
          :title="currentCollapse ? '展开菜单' : '折叠菜单'"
          @click="toggle"
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

          <span aria-hidden='true' v-if="!currentCollapse">折叠菜单</span>
        </button>
      </slot>
    </div>
  </ElAside>
</template>
<script setup lang="ts">
import { ElAside, ElMenu, ElScrollbar } from 'element-plus'
import type { MenuInstance, MenuItemClicked } from 'element-plus'
import type { CSSProperties } from 'vue'
import { computed, getCurrentInstance, ref, watch } from 'vue'

import type {
  GaAsideMenuEmits,
  GaAsideMenuProps,
  GaAsideMenuSlotProps,
  GaAsideMenuTheme,
  GaAsideMenuToggleSlotProps,
} from '../types/index'

defineOptions({
  name: 'GaAsideMenu',
  inheritAttrs: false,
})

const slots = defineSlots<{
  header?: (scope: GaAsideMenuSlotProps) => unknown
  default?: () => unknown
  footer?: (scope: GaAsideMenuSlotProps) => unknown
  collapse?: (scope: GaAsideMenuToggleSlotProps) => unknown
}>()

const props = withDefaults(defineProps<GaAsideMenuProps>(), {
  collapse: false,
  width: '240px',
  collapseWidth: '64px',
  collapseTransition: true,
  ellipsis: true,
  persistent: true,
})

const emit = defineEmits<GaAsideMenuEmits>()
const instance = getCurrentInstance()!
const menuRef = ref<MenuInstance>()
const internalCollapse = ref(props.collapse)

const defaultTheme: Required<GaAsideMenuTheme> = {
  backgroundColor:
    'radial-gradient(130% 55% at 40% -10%, rgba(96, 165, 250, 0.28) 0%, transparent 62%),radial-gradient(85% 40% at 95% 100%, rgba(125, 211, 252, 0.1) 0%, transparent 55%),linear-gradient(168deg, #1d4480 0%, #122c5c 48%, #0a1a3d 100%)',
  textColor: '#d0d5dd',
  activeTextColor: '#ffffff',
  activeBackgroundColor: 'linear-gradient(90deg, #4f6ef7, #7a5cf7)',
  hoverBackgroundColor: 'rgba(59, 130, 246, 0.16)',
  borderColor: '#344054',
}

const currentCollapse = computed(() =>
  isCollapseControlled() ? props.collapse : internalCollapse.value,
)

const currentWidth = computed(() =>
  currentCollapse.value ? props.collapseWidth : props.width,
)

const currentTheme = computed<Required<GaAsideMenuTheme>>(() => ({
  ...defaultTheme,
  ...props.theme,
}))

const themeStyle = computed<CSSProperties>(() => {
  const theme = currentTheme.value
  return {
    '--ga-aside-menu-bg-color': theme.backgroundColor,
    '--ga-aside-menu-text-color': theme.textColor,
    '--ga-aside-menu-active-text-color': theme.activeTextColor,
    '--ga-aside-menu-active-bg-color': theme.activeBackgroundColor,
    '--ga-aside-menu-hover-bg-color': theme.hoverBackgroundColor,
    '--ga-aside-menu-border-color': theme.borderColor,
  }
})

const menuPopperClass = computed(() =>
  [props.popperClass, 'ga-aside-menu__popper'].filter(Boolean).join(' '),
)

const menuPopperStyle = computed(() => {
  if (typeof props.popperStyle === 'string') {
    const themeVariables = Object.entries(themeStyle.value)
      .filter((entry): entry is [string, string] => Boolean(entry[1]))
      .map(([property, value]) => `${property}: ${value}`)
      .join('; ')

    return [props.popperStyle.replace(/;\s*$/, ''), themeVariables]
      .filter(Boolean)
      .join('; ')
  }

  return {
    ...props.popperStyle,
    ...themeStyle.value,
  }
})

const menuProps = computed(() => {
  const {
    collapse: _collapse,
    collapseWidth: _collapseWidth,
    popperClass: _popperClass,
    popperStyle: _popperStyle,
    theme: _theme,
    width: _width,
    ...elementMenuProps
  } = props

  return elementMenuProps
})

watch(
  () => props.collapse,
  (collapse) => {
    internalCollapse.value = collapse
  },
)

function isCollapseControlled() {
  return Boolean(instance.vnode.props?.['onUpdate:collapse'])
}

function setCollapse(collapse: boolean) {
  if (collapse === currentCollapse.value) return

  if (!isCollapseControlled()) internalCollapse.value = collapse
  emit('update:collapse', collapse)
  emit('toggle', collapse)
}

function toggle() {
  setCollapse(!currentCollapse.value)
}

function handleSelect(
  index: string,
  indexPath: string[],
  item: MenuItemClicked,
  routerResult?: Promise<unknown>,
) {
  emit('select', index, indexPath, item, routerResult)
}

function handleOpen(index: string, indexPath: string[]) {
  emit('open', index, indexPath)
}

function handleClose(index: string, indexPath: string[]) {
  emit('close', index, indexPath)
}

defineExpose({
  menuRef,
  toggle,
})
</script>

<style lang="scss">
@use '../style/index.scss';
</style>
