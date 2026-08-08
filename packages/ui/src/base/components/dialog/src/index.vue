<template>
  <ElDialog
    ref="dialogRef"
    v-bind="$attrs"
    class="ga-dialog"
    :model-value="props.modelValue"
    :title="props.title"
    :width="props.width"
    :top="props.top"
    :fullscreen="currentFullscreen"
    :append-to-body="props.appendToBody"
    :destroy-on-close="props.destroyOnClose"
    :center="props.center"
    :align-center="props.alignCenter"
    :draggable="props.draggable"
    :show-close="props.showClose"
    :close-on-click-modal="props.closeOnClickModal"
    :close-on-press-escape="props.closeOnPressEscape"
    :before-close="props.beforeClose"
    @update:model-value="emit('update:modelValue', $event)"
    @open="emit('open')"
    @opened="emit('opened')"
    @close="emit('close')"
    @closed="handleClosed"
    @open-auto-focus="emit('open-auto-focus')"
    @close-auto-focus="emit('close-auto-focus')"
  >
    <template #header="scope">
      <slot v-if="slots.header" name="header" v-bind="scope" />
      <span
        v-else
        :id="scope.titleId"
        :class="scope.titleClass"
        role="heading"
        :aria-level="headerAriaLevel"
      >
        {{ props.title }}
      </span>
      <button
        v-if="props.showFullscreen"
        type="button"
        class="ga-dialog__fullscreenbtn"
        :title="fullscreenLabel"
        :aria-label="fullscreenLabel"
        @click="toggleFullscreen"
      ></button>
    </template>

    <slot />

    <template v-if="slots.footer" #footer>
      <slot name="footer" />
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { ElDialog } from 'element-plus'
import type { DialogInstance } from 'element-plus'
import { computed, ref, useAttrs, useSlots, watch } from 'vue'
import type { Slots } from 'vue'

import type { GaDialogEmits, GaDialogProps } from '../types/index'

defineOptions({
  name: 'GaDialog',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<GaDialogProps>(), {
  modelValue: false,
  title: '',
  fullscreen: false,
  showFullscreen: true,
  appendToBody: true,
  destroyOnClose: true,
  center: false,
  alignCenter: true,
  draggable: true,
  showClose: true,
  closeOnClickModal: false,
  closeOnPressEscape: false,
})

const attrs = useAttrs()
const headerAriaLevel = computed(() => {
  const value = attrs['header-aria-level'] ?? attrs.headerAriaLevel
  return typeof value === 'string' || typeof value === 'number'
    ? String(value)
    : '2'
})

const emit = defineEmits<GaDialogEmits>()
const slots: Slots = useSlots()
const dialogRef = ref<DialogInstance>()
const currentFullscreen = ref(props.fullscreen)
const fullscreenLabel = computed(() =>
  currentFullscreen.value ? '退出全屏' : '全屏',
)

watch(
  () => props.fullscreen,
  (value) => {
    currentFullscreen.value = value
  },
)

const setFullscreen = (value: boolean) => {
  if (currentFullscreen.value === value) return

  currentFullscreen.value = value
  emit('update:fullscreen', value)
}

const toggleFullscreen = () => {
  setFullscreen(!currentFullscreen.value)
}

const handleClosed = () => {
  setFullscreen(props.fullscreen)
  emit('closed')
}

defineExpose({
  dialogRef,
})
</script>

<style lang="scss">
@use '../style/index.scss';
</style>
