<template>
  <div class="theme-controls" role="group" aria-label="侧边栏主题">
    <ElRadioGroup v-model="themeName">
      <ElRadioButton value="default"><span class="theme-dot theme-dot--blue" />默认深蓝</ElRadioButton>
      <ElRadioButton value="light"><span class="theme-dot theme-dot--light" />浅色</ElRadioButton>
      <ElRadioButton value="teal"><span class="theme-dot theme-dot--teal" />青绿</ElRadioButton>
    </ElRadioGroup>
  </div>
  <div class="aside-demo">
    <GaAsideMenu
      v-model:collapse="collapsed"
      width="224px"
      collapse-width="60px"
      default-active="dashboard"
      :theme="themes[themeName]"
      :popper-style="{ borderRadius: '4px' }"
      @select="selectedIndex = $event"
    >
      <ElMenuItem index="dashboard">
        <ElIcon><Odometer /></ElIcon>
        <template #title>工作台</template>
      </ElMenuItem>
      <ElSubMenu index="products">
        <template #title><ElIcon><Goods /></ElIcon><span>产品中心</span></template>
        <ElMenuItem index="catalog"><template #title>产品目录</template></ElMenuItem>
        <ElMenuItem index="inventory"><template #title>库存管理</template></ElMenuItem>
      </ElSubMenu>
      <ElMenuItem index="settings">
        <ElIcon><Setting /></ElIcon>
        <template #title>设置</template>
      </ElMenuItem>
    </GaAsideMenu>

    <div class="aside-demo__content">
      <span>当前页面</span>
      <strong>{{ labels[selectedIndex] }}</strong>
      <small>{{ themeLabels[themeName] }}</small>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Goods, Odometer, Setting } from '@element-plus/icons-vue'
import { ElIcon, ElMenuItem, ElRadioButton, ElRadioGroup, ElSubMenu } from 'element-plus'
import { ref } from 'vue'
import { GaAsideMenu, type GaAsideMenuTheme } from 'ga-ui-plus/business'

type ThemeName = 'default' | 'light' | 'teal'

const themes: Record<ThemeName, GaAsideMenuTheme | undefined> = {
  default: undefined,
  light: {
    backgroundColor: '#f7faff',
    textColor: '#334155',
    activeTextColor: '#175ca4',
    activeBackgroundColor: '#dcecff',
    hoverBackgroundColor: '#eaf3ff',
    borderColor: '#dce5f0',
  },
  teal: {
    backgroundColor: '#173d3a',
    textColor: '#d5eae5',
    activeTextColor: '#ffffff',
    activeBackgroundColor: '#237b72',
    hoverBackgroundColor: '#285a54',
    borderColor: '#456d67',
  },
}

const themeLabels: Record<ThemeName, string> = {
  default: '默认深蓝', light: '浅色', teal: '青绿',
}
const labels: Record<string, string> = {
  dashboard: '工作台', catalog: '产品目录', inventory: '库存管理', settings: '设置',
}

const themeName = ref<ThemeName>('default')
const collapsed = ref(false)
const selectedIndex = ref('dashboard')
</script>

<style scoped>
.theme-controls { margin-bottom: 16px; }
.aside-demo { display: flex; height: 340px; min-width: 560px; overflow: hidden; background: #f5f7fa; }
.aside-demo__content { display: flex; min-width: 0; flex: 1; flex-direction: column; align-items: flex-start; gap: 12px; padding: 36px 28px; }
.aside-demo__content span { color: #909399; font-size: 12px; }
.aside-demo__content strong { color: #303133; font-size: 22px; }
.aside-demo__content small { margin-top: auto; color: #606266; font-size: 12px; }
.theme-dot { display: inline-block; width: 9px; height: 9px; margin-right: 7px; border: 1px solid rgb(48 49 51 / 20%); border-radius: 50%; vertical-align: 1px; }
.theme-dot--blue { background: #1d4480; }
.theme-dot--light { background: #f7faff; }
.theme-dot--teal { background: #173d3a; }
.aside-demo :deep(.el-aside.ga-aside-menu > .ga-aside-menu__collapse > .ga-aside-menu__collapse-button) { color: var(--el-menu-text-color); }
</style>
