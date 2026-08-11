<template>
  <ElAside v-bind="$attrs" :width="currentWidth" class="ga-aside-menu">
    <div v-if="slots.header" class="ga-aside-menu__header">
      <slot name="header" />
    </div>

    <ElScrollbar class="ga-aside-menu__body">
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

    <div v-if="slots.footer" class="ga-aside-menu__footer">
      <slot name="footer" />
    </div>

    <div class="ga-aside-menu__trigger">
      <slot name="trigger" :collapse="currentCollapse" :toggle="toggleCollapse">
        <button
          type="button"
          class="ga-aside-menu__trigger-btn"
          :aria-label="currentCollapse ? '展开菜单' : '折叠菜单'"
          :title="currentCollapse ? '展开菜单' : '折叠菜单'"
          @click="toggleCollapse"
        >
          <svg
            v-if="currentCollapse"
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
import { computed, ref, useSlots, watch } from 'vue'
import type { Slots } from 'vue'

import type { GaAsideMenuEmits, GaAsideMenuProps } from '../types/index'

defineOptions({
  name: 'GaAsideMenu',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<GaAsideMenuProps>(), {
  collapse: false,
  width: '240px',
})

const emit = defineEmits<GaAsideMenuEmits>()
const slots: Slots = useSlots()
const menuRef = ref<MenuInstance>()

// collapse 由组件内部维护，外部可通过 v-model:collapse 同步
const currentCollapse = ref(props.collapse)

watch(
  () => props.collapse,
  (value) => {
    currentCollapse.value = value
  },
)

const setCollapse = (value: boolean) => {
  if (currentCollapse.value === value) return

  currentCollapse.value = value
  emit('update:collapse', value)
  emit('toggle', value)
}

const toggleCollapse = () => {
  setCollapse(!currentCollapse.value)
}

// 折叠时宽度交给 auto，由 Element Plus 折叠菜单自身宽度（64px）决定
const currentWidth = computed(() =>
  currentCollapse.value ? 'auto' : props.width,
)

// collapse/width 由本组件接管，mode 固定 vertical，其余 Props 透传给 ElMenu
const menuProps = computed(() => {
  const { collapse, width, ...elMenuProps } = props
  return elMenuProps
})

const handleSelect = (
  index: string,
  indexPath: string[],
  item: MenuItemClicked,
  routerResult?: Promise<unknown>,
) => {
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
