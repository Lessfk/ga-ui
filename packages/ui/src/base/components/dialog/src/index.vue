<template>
  <ElDialog
    ref="dialogRef"
    v-bind="$attrs"
    class="ga-dialog"
    :model-value="props.modelValue"
    :title="props.title"
    :width="props.width"
    :top="props.top"
    :fullscreen="props.fullscreen"
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
    @closed="emit('closed')"
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
        type="button"
        class="ga-dialog__fullscreenbtn"
        title="全屏"
        aria-label="全屏"
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
import { computed, ref, useAttrs, useSlots } from 'vue'
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

defineExpose({
  dialogRef,
})
</script>

<style lang="scss">
@use '../style/index.scss';
</style>
