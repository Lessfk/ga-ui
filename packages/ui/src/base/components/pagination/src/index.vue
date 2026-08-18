<template>
  <ElPagination
    v-bind="paginationAttrs"
    class="ga-pagination"
    :class="[positionClass]"
    :style="paginationStyle"
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
import { computed, useAttrs } from 'vue'
import type { CSSProperties } from 'vue'

import type { GaPaginationProps, GaPaginationTheme } from './props'

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
  background: false,
  position: 'right',
})

const attrs = useAttrs()

const defaultTheme: Required<GaPaginationTheme> = {
  backgroundColor: '#EEEEEF',
  textColor: '#606266',
  buttonColor: '#7A7475',
  buttonBackgroundColor: '#ffffff',
  activeColor: '#ffffff',
  activeBackgroundColor: '#4F7DB2',
  hoverColor: '#ffffff',
  hoverBackgroundColor: '#4f7db299',
  disabledColor: '#606266',
  disabledBackgroundColor: '#fafafa',
}

const currentTheme = computed<Required<GaPaginationTheme>>(() => ({
  ...defaultTheme,
  ...props.theme,
}))

const themeStyle = computed<CSSProperties>(() => ({
  '--ga-pagination-background': currentTheme.value.backgroundColor,
  '--ga-pagination-text-color': currentTheme.value.textColor,
  '--el-pagination-bg-color': currentTheme.value.buttonBackgroundColor,
  '--el-pagination-button-color': currentTheme.value.buttonColor,
  '--el-pagination-button-bg-color': currentTheme.value.buttonBackgroundColor,
  '--ga-pagination-active-color': currentTheme.value.activeColor,
  '--ga-pagination-active-bg-color': currentTheme.value.activeBackgroundColor,
  '--el-pagination-hover-color': currentTheme.value.hoverColor,
  '--ga-pagination-hover-bg-color': currentTheme.value.hoverBackgroundColor,
  '--el-pagination-button-disabled-color': currentTheme.value.disabledColor,
  '--el-pagination-button-disabled-bg-color':
    currentTheme.value.disabledBackgroundColor,
}))

const paginationAttrs = computed(() => {
  const { style: _style, ...forwardedAttrs } = attrs
  return forwardedAttrs
})

const paginationStyle = computed(() => [themeStyle.value, attrs.style])

const positionClass = computed(() => {
  const className = `is-${props.position}`
  if (className) {
    return className
  }
  return ''
})

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
