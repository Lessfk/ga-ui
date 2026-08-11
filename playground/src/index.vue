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
