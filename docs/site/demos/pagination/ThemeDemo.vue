<script setup lang="ts">
import { ref } from 'vue'
import type { GaPaginationTheme } from 'ga-ui-plus/base'

const currentPage = ref(1)

const theme: GaPaginationTheme = {
  backgroundColor: '#f4f7f6',
  textColor: '#52615d',
  buttonColor: '#24564e',
  buttonBackgroundColor: '#ffffff',
  activeColor: '#ffffff',
  activeBackgroundColor: '#087b62',
  hoverColor: '#ffffff',
  hoverBackgroundColor: '#2d8b75',
  disabledColor: '#9aa8a4',
  disabledBackgroundColor: '#edf1f0',
}
</script>

<template>
  <GaPagination
    v-model:current-page="currentPage"
    :page-size="10"
    :total="80"
    :theme="theme"
    layout="prev, pager, next"
    position="center"
    background
  />
</template>
