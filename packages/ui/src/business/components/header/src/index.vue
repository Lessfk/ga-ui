<template>
  <ElHeader
    v-bind="getHeaderAttrs()"
    class="ga-header"
    :height="formattedHeight"
    :style="[internalHeaderStyle, attrs.style]"
  >
    <div class="ga-header__left">
      <slot name="left" />
    </div>

    <div class="ga-header__center">
      <GaMegaMenu
        ref="megaMenuRef"
        v-bind="megaMenuProps"
        :active-key="currentActiveKey"
        :open-key="currentOpenKey"
        @update:active-key="handleActiveKeyUpdate"
        @update:open-key="handleOpenKeyUpdate"
        @select="handleSelect"
        @open="handleOpen"
        @close="handleClose"
      >
        <template v-if="slots['menu-item']" #menu-item="scope">
          <slot name="menu-item" v-bind="scope" />
        </template>
        <template v-if="slots['group-title']" #group-title="scope">
          <slot name="group-title" v-bind="scope" />
        </template>
        <template v-if="slots['panel-item']" #panel-item="scope">
          <slot name="panel-item" v-bind="scope" />
        </template>
        <template v-if="slots.empty" #empty="scope">
          <slot name="empty" v-bind="scope" />
        </template>
      </GaMegaMenu>
    </div>

    <div class="ga-header__right">
      <slot name="right" />
    </div>
  </ElHeader>
</template>

<script setup lang="ts">
import { ElHeader } from 'element-plus'
import {
  computed,
  getCurrentInstance,
  ref,
  useAttrs,
  watch,
} from 'vue'
import type { CSSProperties } from 'vue'

import { GaMegaMenu } from '../../../../base/index'
import type {
  GaMegaMenuExpose,
  GaMegaMenuKey,
  GaMegaMenuNavItem,
  GaMegaMenuSelectPayload,
} from '../../../../base/index'
import type {
  GaHeaderEmits,
  GaHeaderExpose,
  GaHeaderProps,
  GaHeaderSlots,
} from '../types/index'

defineOptions({
  name: 'GaHeader',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<GaHeaderProps>(), {
  height: 64,
  padding: '0 20px',
  gap: 16,
  closeOnSelect: true,
})

const emit = defineEmits<GaHeaderEmits>()
const slots = defineSlots<GaHeaderSlots>()
const attrs = useAttrs()
const instance = getCurrentInstance()
const megaMenuRef = ref<GaMegaMenuExpose>()
const internalActiveKey = ref<GaMegaMenuKey | undefined>(props.activeKey)
const internalOpenKey = ref<GaMegaMenuKey | undefined>(props.openKey)

const formattedHeight = computed(() => formatSize(props.height))

const internalHeaderStyle = computed<CSSProperties>(() => ({
  '--ga-header-gap': formatSize(props.gap),
  '--ga-header-padding': props.padding,
  '--ga-header-background':
    props.backgroundColor ?? props.theme?.menuBackgroundColor ?? '#2f436b',
}))

const megaMenuProps = computed(() => {
  const {
    activeKey: _activeKey,
    openKey: _openKey,
    height: _height,
    padding: _padding,
    gap: _gap,
    backgroundColor: _backgroundColor,
    ...menuProps
  } = props

  return menuProps
})

const currentActiveKey = computed(() =>
  isControlled('activeKey') ? props.activeKey : internalActiveKey.value,
)

const currentOpenKey = computed(() =>
  isControlled('openKey') ? props.openKey : internalOpenKey.value,
)

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

function formatSize(value: string | number) {
  return typeof value === 'number' ? `${value}px` : value
}

function getHeaderAttrs() {
  const { style: _style, ...rest } = attrs
  return rest
}

function hasVNodeProp(name: string) {
  const vnodeProps = instance?.vnode.props
  if (!vnodeProps) return false

  const kebabName = name.replace(/[A-Z]/g, (letter) =>
    `-${letter.toLowerCase()}`,
  )

  return [name, kebabName].some((key) =>
    Object.prototype.hasOwnProperty.call(vnodeProps, key),
  )
}

function isControlled(name: 'activeKey' | 'openKey') {
  return hasVNodeProp(name)
}

function handleActiveKeyUpdate(key: GaMegaMenuKey) {
  if (!isControlled('activeKey')) internalActiveKey.value = key
  emit('update:activeKey', key)
}

function handleOpenKeyUpdate(key: GaMegaMenuKey | undefined) {
  if (!isControlled('openKey')) internalOpenKey.value = key
  emit('update:openKey', key)
}

function handleSelect(payload: GaMegaMenuSelectPayload) {
  emit('select', payload)
}

function handleOpen(key: GaMegaMenuKey, menu: GaMegaMenuNavItem) {
  emit('open', key, menu)
}

function handleClose(key: GaMegaMenuKey, menu: GaMegaMenuNavItem) {
  emit('close', key, menu)
}

function open(key: GaMegaMenuKey) {
  megaMenuRef.value?.open(key)
}

function close() {
  megaMenuRef.value?.close()
}

function toggle(key: GaMegaMenuKey) {
  megaMenuRef.value?.toggle(key)
}

defineExpose<GaHeaderExpose>({
  get megaMenuRef() {
    return megaMenuRef.value
  },
  open,
  close,
  toggle,
})
</script>

<style lang="scss">
@use '../style/index.scss';
</style>
