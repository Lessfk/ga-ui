<template>
  <ElAside
    v-bind="$attrs"
    class="ga-aside-menu"
    :class="{ 'is-collapse': currentCollapse }"
    :width="currentWidth"
  >
    <div
      v-if="slots.header"
      class="ga-aside-menu__header"
    >
      <slot
        name="header"
        :collapse="currentCollapse"
      />
    </div>

    <ElScrollbar class="ga-aside-menu__scrollbar">
      <ElMenu
        ref="menuRef"
        v-bind="menuProps"
        class="ga-aside-menu__menu"
        mode="vertical"
        :collapse="currentCollapse"
        @select="handleSelect"
        @open="handleOpen"
        @close="handleClose"
      >
        <slot />
      </ElMenu>
    </ElScrollbar>

    <div
      v-if="slots.footer"
      class="ga-aside-menu__footer"
    >
      <slot
        name="footer"
        :collapse="currentCollapse"
      />
    </div>

    <div class="ga-aside-menu__collapse">
      <slot
        name="collapse"
        :collapse="currentCollapse"
        :toggle="toggle"
      >
        <button
          type="button"
          class="ga-aside-menu__collapse-button"
          :aria-label="currentCollapse ? '展开菜单' : '折叠菜单'"
          :title="currentCollapse ? '展开菜单' : '折叠菜单'"
          @click="toggle"
        >
          <span aria-hidden="true">
            {{ currentCollapse ? '›' : '‹' }}
          </span>
          <span v-if="!currentCollapse">折叠菜单</span>
        </button>
      </slot>
    </div>
  </ElAside>
</template>

<script setup lang="ts">
import { ElAside, ElMenu, ElScrollbar } from 'element-plus'
import type { MenuInstance, MenuItemClicked } from 'element-plus'
import { computed, getCurrentInstance, ref, watch } from 'vue'

import type {
  GaAsideMenuEmits,
  GaAsideMenuProps,
  GaAsideMenuSlotProps,
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

const currentCollapse = computed(() =>
  isCollapseControlled() ? props.collapse : internalCollapse.value,
)

const currentWidth = computed(() =>
  currentCollapse.value ? props.collapseWidth : props.width,
)

const menuProps = computed(() => {
  const {
    collapse: _collapse,
    collapseWidth: _collapseWidth,
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
