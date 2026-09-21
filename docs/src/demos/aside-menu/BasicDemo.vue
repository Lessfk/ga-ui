<template>
  <div class="aside-demo">
    <GaAsideMenu
      v-model:collapse="collapsed"
      width="240px"
      default-active="1-1"
      unique-opened
      @select="handleSelect"
    >
      <template #header="{ collapse }">
        <div class="aside-logo">
          <ElIcon><Grid /></ElIcon>
          <span v-if="!collapse">Ga Admin</span>
        </div>
      </template>

      <ElSubMenu index="1">
        <template #title>
          <ElIcon><Setting /></ElIcon>
          <span>系统管理</span>
        </template>
        <ElMenuItem index="1-1">
          <ElIcon><User /></ElIcon>
          <template #title>用户管理</template>
        </ElMenuItem>
        <ElMenuItem index="1-2">
          <template #title>权限管理</template>
        </ElMenuItem>
      </ElSubMenu>

      <ElMenuItemGroup title="看板">
        <ElMenuItem index="2-1">
          <template #title>数据概览</template>
        </ElMenuItem>
      </ElMenuItemGroup>
    </GaAsideMenu>
  </div>
</template>

<script setup lang="ts">
import { Grid, Setting, User } from '@element-plus/icons-vue'
import { ElIcon, ElMenuItem, ElMenuItemGroup, ElSubMenu } from 'element-plus'
import { ref } from 'vue'

import { GaAsideMenu } from 'ga-ui-plus/business'

const collapsed = ref(false)

function handleSelect(index: string) {
  void index
}
</script>

<style scoped>
.aside-demo {
  height: 420px;
  overflow: hidden;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
}

.aside-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 56px;
  padding-inline: 16px;
  font-weight: 600;
}
</style>
