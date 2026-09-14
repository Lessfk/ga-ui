<script setup lang="ts">
import { DataAnalysis, Fold, House, Setting, User } from '@element-plus/icons-vue'
import { ref } from 'vue'

const collapsed = ref(false)
const selected = ref('dashboard')
</script>

<template>
  <div class="aside-demo">
    <GaAsideMenu
      v-model:collapse="collapsed"
      default-active="dashboard"
      width="220px"
      collapse-width="64px"
      @select="selected = $event"
    >
      <template #header="{ collapse }">
        <div class="aside-demo__brand">
          <ElIcon><DataAnalysis /></ElIcon>
          <strong v-if="!collapse">GA Console</strong>
        </div>
      </template>

      <ElMenuItem index="dashboard">
        <ElIcon><House /></ElIcon>
        <template #title>工作台</template>
      </ElMenuItem>

      <ElSubMenu index="system">
        <template #title>
          <ElIcon><Setting /></ElIcon>
          <span>系统管理</span>
        </template>
        <ElMenuItem index="users">
          <ElIcon><User /></ElIcon>
          <template #title>用户管理</template>
        </ElMenuItem>
      </ElSubMenu>

      <template #footer="{ collapse }">
        <div class="aside-demo__footer">
          {{ collapse ? 'GA' : `当前：${selected}` }}
        </div>
      </template>

      <template #collapse="{ collapse, toggle }">
        <button
          type="button"
          class="aside-demo__toggle"
          :aria-label="collapse ? '展开菜单' : '折叠菜单'"
          @click="toggle"
        >
          <ElIcon><Fold /></ElIcon>
          <span v-if="!collapse">折叠菜单</span>
        </button>
      </template>
    </GaAsideMenu>

    <main class="aside-demo__content">
      <strong>内容区域</strong>
      <span>当前菜单：{{ selected }}</span>
    </main>
  </div>
</template>

<style scoped>
.aside-demo {
  display: flex;
  height: 380px;
  overflow: hidden;
  border: 1px solid #dfe5ec;
}

.aside-demo__brand,
.aside-demo__footer,
.aside-demo__toggle {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 52px;
  padding: 0 16px;
  box-sizing: border-box;
  color: inherit;
}

.aside-demo__footer {
  font-size: 12px;
  opacity: 0.72;
}

.aside-demo__toggle {
  width: 100%;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.aside-demo__content {
  display: grid;
  flex: 1;
  place-content: center;
  gap: 8px;
  color: #5b6675;
  text-align: center;
  background: #f6f8fa;
}
</style>
