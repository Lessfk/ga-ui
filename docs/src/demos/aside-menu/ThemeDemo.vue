<template>
  <div class="aside-theme-demo">
    <GaAsideMenu
      v-model:collapse="collapsed"
      width="220px"
      default-active="dashboard"
      :theme="theme"
    >
      <ElMenuItem index="dashboard">
        <ElIcon><Odometer /></ElIcon>
        <template #title>工作台</template>
      </ElMenuItem>
      <ElSubMenu index="system">
        <template #title>
          <ElIcon><Setting /></ElIcon>
          <span>系统管理</span>
        </template>
        <ElMenuItem index="users">
          <template #title>用户管理</template>
        </ElMenuItem>
        <ElMenuItem index="roles">
          <template #title>角色管理</template>
        </ElMenuItem>
      </ElSubMenu>
    </GaAsideMenu>
  </div>
</template>

<script setup lang="ts">
import { Odometer, Setting } from '@element-plus/icons-vue'
import { ElIcon, ElMenuItem, ElSubMenu } from 'element-plus'
import { ref } from 'vue'

import { GaAsideMenu, type GaAsideMenuTheme } from 'ga-ui-plus/business'

const collapsed = ref(false)

const theme: GaAsideMenuTheme = {
  backgroundColor: '#101828',
  textColor: '#d0d5dd',
  activeTextColor: '#ffffff',
  activeBackgroundColor: '#155eef',
  hoverBackgroundColor: '#1d2939',
  borderColor: '#344054',
}
</script>

<style scoped>
.aside-theme-demo {
  height: 380px;
  overflow: hidden;
  border-radius: 8px;
}
</style>
