<script setup lang="ts">
import { ref } from 'vue'

const currentPage = ref(2)
const pageSize = ref(10)
const disabled = ref(false)
</script>

<template>
  <div class="ga-doc-stack">
    <div class="ga-doc-actions">
      <ElSwitch v-model="disabled" active-text="禁用分页" />
      <span class="ga-doc-note">
        第 {{ currentPage }} 页，每页 {{ pageSize }} 条
      </span>
    </div>

    <GaPagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :total="126"
      :disabled="disabled"
      :pager-count="5"
      layout="total, sizes, prev, pager, next"
      background
    />
  </div>
</template>
