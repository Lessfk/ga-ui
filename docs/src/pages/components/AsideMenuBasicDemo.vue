<template>
  <div class="aside-demo">
    <GaAsideMenu
      v-model:collapse="collapsed"
      width="224px"
      collapse-width="60px"
      default-active="users"
      :default-openeds="['system']"
      unique-opened
      @select="handleSelect"
      @open="handleOpen"
      @close="handleClose"
    >
      <ElMenuItem index="overview">
        <ElIcon><Odometer /></ElIcon>
        <template #title>工作台</template>
      </ElMenuItem>

      <ElSubMenu index="system">
        <template #title><ElIcon><Setting /></ElIcon><span>系统管理</span></template>
        <ElMenuItem index="users"><ElIcon><User /></ElIcon><template #title>用户管理</template></ElMenuItem>
        <ElMenuItem index="roles"><template #title>角色权限</template></ElMenuItem>
      </ElSubMenu>

      <ElSubMenu index="reports">
        <template #title><ElIcon><DataAnalysis /></ElIcon><span>数据报表</span></template>
        <ElMenuItem index="sales"><template #title>销售统计</template></ElMenuItem>
        <ElMenuItem index="traffic"><template #title>访问分析</template></ElMenuItem>
      </ElSubMenu>
    </GaAsideMenu>

    <div class="aside-demo__content">
      <span>当前页面</span>
      <strong>{{ labels[selectedIndex] }}</strong>
      <code>{{ selectedIndex }}</code>
      <small>{{ lastEvent }}</small>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DataAnalysis, Odometer, Setting, User } from '@element-plus/icons-vue'
import { ElIcon, ElMenuItem, ElSubMenu } from 'element-plus'
import { ref } from 'vue'
import { GaAsideMenu } from 'ga-ui-plus/business'

const collapsed = ref(false)
const selectedIndex = ref('users')
const lastEvent = ref('尚未操作')
const labels: Record<string, string> = {
  overview: '工作台', users: '用户管理', roles: '角色权限',
  sales: '销售统计', traffic: '访问分析',
}

function handleSelect(index: string, indexPath: string[]) {
  selectedIndex.value = index
  lastEvent.value = `选中路径：${indexPath.join(' / ')}`
}

function handleOpen(index: string) {
  lastEvent.value = `展开：${index}`
}

function handleClose(index: string) {
  lastEvent.value = `收起：${index}`
}
</script>

<style scoped>
.aside-demo { display: flex; height: 360px; min-width: 560px; overflow: hidden; background: #f5f7fa; }
.aside-demo__content { display: flex; min-width: 0; flex: 1; flex-direction: column; align-items: flex-start; gap: 12px; padding: 36px 28px; }
.aside-demo__content span { color: #909399; font-size: 12px; }
.aside-demo__content strong { color: #303133; font-size: 22px; }
.aside-demo__content code { color: #409eff; font-size: 13px; }
.aside-demo__content small { margin-top: auto; color: #606266; font-size: 12px; }
</style>
