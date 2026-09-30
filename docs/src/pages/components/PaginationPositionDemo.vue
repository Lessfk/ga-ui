<template>
  <div class="pagination-demo-toolbar">
    <ElRadioGroup v-model="position" aria-label="对齐方式">
      <ElRadioButton value="left">居左</ElRadioButton>
      <ElRadioButton value="center">居中</ElRadioButton>
      <ElRadioButton value="right">居右</ElRadioButton>
    </ElRadioGroup>
    <span>第 {{ currentPage }} 页</span>
  </div>
  <GaPagination
    v-model:current-page="currentPage"
    :total="80"
    :position="position"
    layout="prev, pager, next"
  />
</template>

<script setup lang="ts">
import { ElRadioButton, ElRadioGroup } from 'element-plus'
import { ref } from 'vue'
import { GaPagination } from 'ga-ui-plus/base'

const position = ref<'left' | 'center' | 'right'>('right')
const currentPage = ref(1)
</script>

<style scoped>
.pagination-demo-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
  color: #606266;
  font-size: 13px;
}
</style>
