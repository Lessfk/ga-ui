<script setup lang="ts">
import { House, Monitor, Setting } from '@element-plus/icons-vue'
import { ref } from 'vue'
import type { GaAsideMenuTheme } from 'ga-ui-plus/business'

const collapsed = ref(false)

const theme: GaAsideMenuTheme = {
  backgroundColor: '#173d35',
  textColor: '#d9eee8',
  activeTextColor: '#ffffff',
  activeBackgroundColor: '#087b62',
  hoverBackgroundColor: '#24564e',
  borderColor: '#32675f',
}
</script>

<template>
  <div class="aside-theme-demo">
    <GaAsideMenu
      v-model:collapse="collapsed"
      :theme="theme"
      default-active="monitor"
      width="220px"
    >
      <template #header="{ collapse }">
        <div class="aside-theme-demo__brand">
          <ElIcon><Setting /></ElIcon>
          <strong v-if="!collapse">绿色主题</strong>
        </div>
      </template>

      <ElMenuItem index="home">
        <ElIcon><House /></ElIcon>
        <template #title>首页</template>
      </ElMenuItem>
      <ElMenuItem index="monitor">
        <ElIcon><Monitor /></ElIcon>
        <template #title>运行监控</template>
      </ElMenuItem>
    </GaAsideMenu>

    <ElButton class="aside-theme-demo__button" @click="collapsed = !collapsed">
      {{ collapsed ? '展开' : '折叠' }}
    </ElButton>
  </div>
</template>

<style scoped>
.aside-theme-demo {
  position: relative;
  display: flex;
  height: 300px;
  overflow: hidden;
  border: 1px solid #dfe5ec;
  background: #f6f8fa;
}

.aside-theme-demo__brand {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 52px;
  padding: 0 16px;
}

.aside-theme-demo__button {
  margin: 20px;
}
</style>
