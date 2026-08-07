<template>
  <ElPagination
    v-bind="$attrs"
    class="ga-pagination"
    :class="[positionClass]"
    :current-page="props.currentPage"
    :page-size="props.pageSize"
    :total="props.total"
    :page-sizes="props.pageSizes"
    :size="props.size"
    :layout="props.layout"
    :background="props.background"
    @current-change="handleCurrentChange"
    @size-change="handleSizeChange"
  />
</template>

<script setup lang="ts">
import { ElPagination } from 'element-plus'

import type { GaPaginationProps } from './props'
import { computed } from 'vue';


defineOptions({
  name: 'GaPagination',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<GaPaginationProps>(), {
  currentPage: 1,
  pageSize: 10,
  total: 100,
  pageSizes: () => [10, 20, 30, 40, 50],
  size: 'default',
  layout: 'total, sizes, prev, pager, next, jumper',
  background: true,
  position: 'right',
})

const positionClass = computed(() => {
  let className = `is-${props.position}`;
  if (className) {
    return className;
  }
  return '';
});



const emit = defineEmits<{
  'update:current-page': [currentPage: number]
  'update:page-size': [pageSize: number]
  'current-change': [currentPage: number]
  'size-change': [pageSize: number]
}>()

const handleCurrentChange = (currentPage: number) => {
  emit('update:current-page', currentPage)
  emit('current-change', currentPage)
}

const handleSizeChange = (pageSize: number) => {
  emit('update:page-size', pageSize)
  emit('size-change', pageSize)
}

</script>

<style lang="scss">
@use '../style/index.scss';
</style>
