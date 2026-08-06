<template>
  <ElTable ref="tableRef" v-loading="props.loading" v-bind="$attrs" class="ga-table" :data="props.data"
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
import { ref, useSlots } from 'vue'
import type { Slots } from 'vue'

import { getColumnKey, getColumnProps } from './column'
import type { GaTableProps } from './props'
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

const slots: Slots = useSlots()
const tableRef = ref<TableInstance>()
defineExpose({
  tableRef,
})
</script>

<style lang="scss">
@use "../style/index.scss";
</style>
