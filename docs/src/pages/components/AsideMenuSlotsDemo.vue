<template>
  <div class="aside-demo">
    <GaAsideMenu
      ref="asideRef"
      v-model:collapse="collapsed"
      width="224px"
      collapse-width="60px"
      default-active="projects"
      @select="selectedIndex = $event"
    >
      <template #header="{ collapse }">
        <div class="aside-brand">
          <ElIcon><Grid /></ElIcon>
          <span v-if="!collapse">Project Hub</span>
        </div>
      </template>

      <ElMenuItem index="projects">
        <ElIcon><FolderOpened /></ElIcon>
        <template #title>项目列表</template>
      </ElMenuItem>
      <ElSubMenu index="assets">
        <template #title><ElIcon><Files /></ElIcon><span>文件资源</span></template>
        <ElMenuItem index="my-files"><template #title>我的文件</template></ElMenuItem>
        <ElMenuItem index="shared"><template #title>共享文件</template></ElMenuItem>
      </ElSubMenu>

      <template #footer="{ collapse }">
        <div class="aside-account">
          <ElIcon><User /></ElIcon>
          <span v-if="!collapse">演示账户</span>
        </div>
      </template>

      <template #collapse="{ collapse, toggle }">
        <button
          type="button"
          class="aside-custom-toggle"
          :aria-label="collapse ? '展开侧栏' : '折叠侧栏'"
          :title="collapse ? '展开侧栏' : '折叠侧栏'"
          @click="toggle"
        >
          <ElIcon><Expand v-if="collapse" /><Fold v-else /></ElIcon>
          <span v-if="!collapse">收起侧栏</span>
        </button>
      </template>
    </GaAsideMenu>

    <div class="aside-demo__content">
      <span>当前页面</span>
      <strong>{{ labels[selectedIndex] }}</strong>
      <ElButton :icon="collapsed ? Expand : Fold" @click="asideRef?.toggle()">
        {{ collapsed ? '展开侧栏' : '折叠侧栏' }}
      </ElButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Expand, Files, Fold, FolderOpened, Grid, User } from '@element-plus/icons-vue'
import { ElButton, ElIcon, ElMenuItem, ElSubMenu } from 'element-plus'
import { ref } from 'vue'
import { GaAsideMenu, type GaAsideMenuExpose } from 'ga-ui-plus/business'

const asideRef = ref<GaAsideMenuExpose>()
const collapsed = ref(false)
const selectedIndex = ref('projects')
const labels: Record<string, string> = {
  projects: '项目列表', 'my-files': '我的文件', shared: '共享文件',
}
</script>

<style scoped>
.aside-demo { display: flex; height: 360px; min-width: 560px; overflow: hidden; background: #f5f7fa; }
.aside-brand, .aside-account { display: flex; align-items: center; gap: 12px; height: 54px; padding: 0 18px; color: #fff; white-space: nowrap; }
.aside-brand { font-size: 14px; font-weight: 700; }
.aside-account { height: 48px; color: #d0d5dd; font-size: 13px; }
.aside-brand .el-icon, .aside-account .el-icon { flex: 0 0 auto; font-size: 20px; }
.aside-custom-toggle { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; height: 42px; border: 0; background: transparent; color: #fff; cursor: pointer; font: inherit; font-size: 13px; }
.aside-custom-toggle:hover { background: rgb(255 255 255 / 9%); }
.aside-custom-toggle:focus-visible { outline: 2px solid #8db7f0; outline-offset: -2px; }
.aside-demo__content { display: flex; min-width: 0; flex: 1; flex-direction: column; align-items: flex-start; gap: 12px; padding: 36px 28px; }
.aside-demo__content span { color: #909399; font-size: 12px; }
.aside-demo__content strong { color: #303133; font-size: 22px; }
.aside-demo__content .el-button { margin-top: 8px; }
</style>
