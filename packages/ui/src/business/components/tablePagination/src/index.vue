<template>
  <div
    v-bind="$attrs"
    class="ga-table-pagination"
  >
    <GaTable
      :data="props.data"
      :columns="props.columns"
      :row-key="props.rowKey"
      :border="props.border"
      :stripe="props.stripe"
      :size="props.size"
      :fit="props.fit"
      :show-header="props.showHeader"
      :highlight-current-row="props.highlightCurrentRow"
      :empty-text="props.emptyText"
      :loading="props.loading"
      :loading-text="props.loadingText"
      height="100%"
    >
      <template
        v-for="(_, slotName) in $slots"
        #[slotName]="scope"
      >
        <slot
          :name="slotName"
          v-bind="scope ?? {}"
        />
      </template>
    </GaTable>

    <GaPagination
      :current-page="props.currentPage"
      :page-size="props.pageSize"
      :total="props.total"
      :page-sizes="props.pageSizes"
      :size="props.size"
      :layout="props.layout"
      :background="props.background"
      :position="props.position"
      :theme="props.theme"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script setup lang="ts" generic="Row extends GaTableRow = GaTableRow">
import {
  GaPagination,
  GaTable,
} from '../../../../base/index'
import type {
  GaTableCellScope,
  GaTableRow,
} from '../../../../base/index'

import type { GaTablePaginationProps } from './props'

defineOptions({
  name: 'GaTablePagination',
  inheritAttrs: false,
})

defineSlots<Record<
  string,
  (scope: GaTableCellScope<Row>) => unknown
>>()

const props = withDefaults(
  defineProps<GaTablePaginationProps<Row>>(),
  {
    border: true,
    stripe: true,
    fit: true,
    showHeader: true,
    background: true,
  },
)

const emit = defineEmits<{
  'update:current-page': [currentPage: number]
  'update:page-size': [pageSize: number]
  'current-change': [currentPage: number]
  'size-change': [pageSize: number]
}>()

function handleCurrentChange(currentPage: number) {
  emit('update:current-page', currentPage)
  emit('current-change', currentPage)
}

function handleSizeChange(pageSize: number) {
  emit('update:page-size', pageSize)
  emit('size-change', pageSize)
}
</script>

<style lang="scss">
@use '../style/index.scss';
</style>
