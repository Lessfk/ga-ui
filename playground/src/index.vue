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
    :show-close="false"
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
      <div v-else class="ga-dialog__header">
        <span
          :id="scope.titleId"
          :class="scope.titleClass"
          role="heading"
          :aria-level="headerAriaLevel"
        >
          {{ props.title }}
        </span>
        <div class="ga-dialog__header-btns">
          <button
            v-if="props.showFullscreen"
            type="button"
            class="ga-dialog__fullscreenbtn"
            :title="fullscreenLabel"
            :aria-label="fullscreenLabel"
            @click="toggleFullscreen"
          >
            <svg
              v-if="!currentFullscreen"
              class="ga-dialog__fullscreen-icon ga-dialog__fullscreen-icon--expand"
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
              <path d="M4 8v-2a2 2 0 0 1 2 -2h2" />
              <path d="M4 16v2a2 2 0 0 0 2 2h2" />
              <path d="M16 4h2a2 2 0 0 1 2 2v2" />
              <path d="M16 20h2a2 2 0 0 0 2 -2v-2" />
            </svg>

            <svg
              v-else
              class="ga-dialog__fullscreen-icon ga-dialog__fullscreen-icon--restore"
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
              <path d="M15 19v-2a2 2 0 0 1 2 -2h2" />
              <path d="M15 5v2a2 2 0 0 0 2 2h2" />
              <path d="M5 15h2a2 2 0 0 1 2 2v2" />
              <path d="M5 9h2a2 2 0 0 0 2 -2v-2" />
            </svg>
          </button>
          <button
            v-if="props.showClose"
            type="button"
            class="ga-dialog__closebtn"
            title="关闭"
            aria-label="关闭"
            @click="toggleFullscreen"
          >
            <svg
              class="ga-dialog__fullscreen-icon ga-dialog__fullscreen-icon--restore"
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
              <path d="M18 6l-12 12" />
              <path d="M6 6l12 12" />
            </svg>
            <!-- <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="ga-dialog__fullscreen-icon ga-dialog__fullscreen-icon--restore"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path
                d="M6.707 5.293l5.293 5.292l5.293 -5.292a1 1 0 0 1 1.414 1.414l-5.292 5.293l5.292 5.293a1 1 0 0 1 -1.414 1.414l-5.293 -5.292l-5.293 5.292a1 1 0 1 1 -1.414 -1.414l5.292 -5.293l-5.292 -5.293a1 1 0 0 1 1.414 -1.414"
              />
            </svg> -->
          </button>
        </div>
      </div>
    </template>

    <slot />

    <template v-if="slots.footer" #footer>
      <slot name="footer" />
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { ElDialog } from "element-plus";
import type { DialogInstance } from "element-plus";
import { computed, ref, useAttrs, useSlots, watch } from "vue";
import type { Slots } from "vue";

// import type { GaDialogEmits, GaDialogProps } from '../types/index'

defineOptions({
  name: "GaDialog",
  inheritAttrs: false,
});

const props = withDefaults(defineProps<GaDialogProps>(), {
  modelValue: false,
  title: "",
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
});

const attrs = useAttrs();
const headerAriaLevel = computed(() => {
  const value = attrs["header-aria-level"] ?? attrs.headerAriaLevel;
  return typeof value === "string" || typeof value === "number"
    ? String(value)
    : "2";
});

const emit = defineEmits<GaDialogEmits>();
const slots: Slots = useSlots();
const dialogRef = ref<DialogInstance>();
const currentFullscreen = ref(props.fullscreen);
const fullscreenLabel = computed(() =>
  currentFullscreen.value ? "退出全屏" : "全屏",
);

watch(
  () => props.fullscreen,
  (value) => {
    currentFullscreen.value = value;
  },
);

const setFullscreen = (value: boolean) => {
  if (currentFullscreen.value === value) return;

  currentFullscreen.value = value;
  emit("update:fullscreen", value);
};

const toggleFullscreen = () => {
  setFullscreen(!currentFullscreen.value);
};

const handleClosed = () => {
  setFullscreen(props.fullscreen);
  emit("closed");
};

defineExpose({
  dialogRef,
});
</script>

<style lang="scss">
@use "../style/index.scss";
</style>
