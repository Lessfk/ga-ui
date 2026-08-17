<template>
  <ElTable ref="tableRef" v-loading="props.loading" v-bind="tableAttrs" class="ga-table" :style="tableStyle" :data="props.data"
      :height="props.height" :max-height="props.maxHeight" :row-key="props.rowKey" :border="props.border"
      :stripe="props.stripe" :size="props.size" :fit="props.fit" :show-header="props.showHeader"
      :highlight-current-row="props.highlightCurrentRow" :empty-text="props.emptyText"
      :element-loading-text="props.loadingText">

    <!-- 列前置内容 -->
    <slot name="column-prepend" />

    <!-- 自定义列内容 -->
    <ElTableColumn v-for="(column, index) in props.columns" :key="getColumnKey(column, index)"
      v-bind="getColumnProps(column)">
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

<script setup lang="ts" generic="Row extends GaTableRow = GaTableRow">
import {
  ElTable,
  ElTableColumn,
  ElEmpty,
  vLoading,
} from 'element-plus'
import type { TableInstance } from 'element-plus'
import { computed, ref, useAttrs, useSlots } from 'vue'
import type { CSSProperties, Slots } from 'vue'

import { getColumnKey, getColumnProps } from './column'
import type { GaTableProps, GaTableTheme } from './props'
import type { GaTableRow } from '../types'

defineOptions({
  name: 'GaTable',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<GaTableProps<Row>>(), {
  data: () => [],
  columns: () => [],
  border: true,
  stripe: true,
  fit: true,
  showHeader: true,
  highlightCurrentRow: false,
  emptyText: '暂无数据',
  loading: false,
  loadingText: '加载中...',
})

const attrs = useAttrs()

const defaultTheme: Required<GaTableTheme> = {
  backgroundColor: '#ffffff',
  rowBackgroundColor: '#ffffff',
  textColor: '#303133',
  headerBackgroundColor: '#f6f6f6',
  headerTextColor: '#2b3b5e',
  borderColor: '#e5e7eb',
  stripeBackgroundColor: 'var(--el-fill-color-lighter)',
  hoverBackgroundColor: '#f6f6f6',
  currentRowBackgroundColor: '#ecf5ff',
  expandedRowBackgroundColor: '#fafafa',
}

const currentTheme = computed<Required<GaTableTheme>>(() => ({
  ...defaultTheme,
  ...props.theme,
}))

const themeStyle = computed<CSSProperties>(() => ({
  '--el-table-bg-color': currentTheme.value.backgroundColor,
  '--el-table-tr-bg-color': currentTheme.value.rowBackgroundColor,
  '--el-table-text-color': currentTheme.value.textColor,
  '--el-table-header-bg-color': currentTheme.value.headerBackgroundColor,
  '--el-table-header-text-color': currentTheme.value.headerTextColor,
  '--el-table-border-color': currentTheme.value.borderColor,
  '--ga-table-stripe-bg-color': currentTheme.value.stripeBackgroundColor,
  '--el-table-row-hover-bg-color': currentTheme.value.hoverBackgroundColor,
  '--el-table-current-row-bg-color': currentTheme.value.currentRowBackgroundColor,
  '--el-table-expanded-cell-bg-color': currentTheme.value.expandedRowBackgroundColor,
}))

const tableAttrs = computed(() => {
  const { style: _style, ...forwardedAttrs } = attrs
  return forwardedAttrs
})

const tableStyle = computed(() => [themeStyle.value, attrs.style])

const slots: Slots = useSlots()
const tableRef = ref<TableInstance>()
defineExpose({
  tableRef,
})
</script>

<style lang="scss">
@use "../style/index.scss";
</style>
