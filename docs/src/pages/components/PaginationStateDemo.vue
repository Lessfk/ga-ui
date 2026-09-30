<template>
  <div class="pagination-demo-toolbar">
    <ElRadioGroup v-model="size" aria-label="分页尺寸">
      <ElRadioButton value="small">小</ElRadioButton>
      <ElRadioButton value="default">默认</ElRadioButton>
      <ElRadioButton value="large">大</ElRadioButton>
    </ElRadioGroup>
    <ElSwitch v-model="disabled" active-text="已禁用" inactive-text="可操作" />
  </div>
  <GaPagination
    v-model:current-page="currentPage"
    :total="42"
    :size="size"
    :disabled="disabled"
    layout="prev, pager, next"
    position="left"
  />
</template>

<script setup lang="ts">
import { ElRadioButton, ElRadioGroup, ElSwitch } from 'element-plus'
import { ref } from 'vue'
import { GaPagination } from 'ga-ui-plus/base'

const currentPage = ref(1)
const size = ref<'small' | 'default' | 'large'>('default')
const disabled = ref(false)
</script>

<style scoped>
.pagination-demo-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}
</style>
