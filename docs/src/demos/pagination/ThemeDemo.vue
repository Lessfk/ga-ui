<template>
  <GaPagination
    v-model:current-page="currentPage"
    :total="100"
    :theme="paginationTheme"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { GaPagination, type GaPaginationTheme } from 'ga-ui-plus/base'

const currentPage = ref(1)

const paginationTheme: GaPaginationTheme = {
  backgroundColor: '#f8fafc',
  activeColor: '#ffffff',
  activeBackgroundColor: '#0f766e',
  hoverColor: '#0f766e',
  hoverBackgroundColor: '#ccfbf1',
  disabledColor: '#98a2b3',
  disabledBackgroundColor: '#f2f4f7',
}
</script>
