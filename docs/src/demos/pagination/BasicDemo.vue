<template>
  <GaPagination
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    :total="total"
    position="right"
    @current-change="handleCurrentChange"
    @size-change="handleSizeChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { GaPagination } from 'ga-ui-plus/base'

const currentPage = ref(1)
const pageSize = ref(10)
const total = 86

function handleCurrentChange(page: number) {
  void page
}

function handleSizeChange(size: number) {
  void size
}
</script>
