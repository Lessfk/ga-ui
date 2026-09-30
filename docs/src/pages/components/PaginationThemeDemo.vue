<template>
  <div class="pagination-demo-toolbar">
    <ElRadioGroup v-model="activeTheme" aria-label="分页主题">
      <ElRadioButton value="default"><span class="theme-dot theme-dot--blue" />默认蓝</ElRadioButton>
      <ElRadioButton value="teal"><span class="theme-dot theme-dot--teal" />青绿</ElRadioButton>
      <ElRadioButton value="graphite"><span class="theme-dot theme-dot--graphite" />石墨灰</ElRadioButton>
    </ElRadioGroup>
    <ElSwitch v-model="background" active-text="背景模式" inactive-text="普通模式" />
  </div>
  <GaPagination
    v-model:current-page="currentPage"
    :total="80"
    :background="background"
    :theme="themes[activeTheme]"
    layout="prev, pager, next"
    position="left"
  />
</template>

<script setup lang="ts">
import { ElRadioButton, ElRadioGroup, ElSwitch } from 'element-plus'
import { ref } from 'vue'
import { GaPagination, type GaPaginationTheme } from 'ga-ui-plus/base'

const themes: Record<'default' | 'teal' | 'graphite', GaPaginationTheme | undefined> = {
  default: undefined,
  teal: {
    backgroundColor: '#f0fdfa',
    activeBackgroundColor: '#0f766e',
    hoverColor: '#0f766e',
    hoverBackgroundColor: '#ccfbf1',
  },
  graphite: {
    backgroundColor: '#f1f5f9',
    activeBackgroundColor: '#475569',
    hoverColor: '#334155',
    hoverBackgroundColor: '#e2e8f0',
  },
}

const activeTheme = ref<keyof typeof themes>('default')
const background = ref(false)
const currentPage = ref(1)
</script>

<style scoped>
.pagination-demo-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.theme-dot {
  display: inline-block;
  width: 9px;
  height: 9px;
  margin-right: 7px;
  border-radius: 50%;
  vertical-align: 1px;
}

.theme-dot--blue { background: #4f7db2; }
.theme-dot--teal { background: #0f766e; }
.theme-dot--graphite { background: #475569; }
</style>
