<template>
  <ElTable
    ref="tableRef"
    v-loading="props.loading"
    v-bind="getTableAttrs()"
    class="ga-table"
    :style="getTableStyle()"
    :data="props.data"
    :height="props.height"
    :max-height="props.maxHeight"
    :row-key="props.rowKey"
    :border="props.border"
    :stripe="props.stripe"
    :size="props.size"
    :fit="props.fit"
    :show-header="props.showHeader"
    :highlight-current-row="props.highlightCurrentRow"
    :empty-text="props.emptyText"
    :element-loading-text="props.loadingText"
  >
    <!-- 列前置内容 -->
    <slot name="column-prepend" />

    <!-- 自定义列内容 -->
    <ElTableColumn
      v-for="(column, index) in props.columns"
      :key="getColumnKey(column, index)"
      v-bind="getColumnProps(column)"
    >
      <template v-if="column.slot && slots[column.slot]" #default="scope">
        <slot :name="column.slot" v-bind="scope" />
      </template>
    </ElTableColumn>

    <!-- 自定义表格内容 -->
    <slot />

    <!-- 插入至表格最后一行之后的内容 -->
    <template v-if="slots.append" #append>
      <slot name="append" />
    </template>

    <!-- 当数据为空时自定义的内容 -->
    <template #empty>
      <slot name="empty">
        <ElEmpty :description="props.emptyText" />
      </slot>
    </template>
  </ElTable>
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
