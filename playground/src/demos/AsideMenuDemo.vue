<template>
  <section class="aside-menu-area">
    <h2>GaAsideMenu 侧边栏菜单示例</h2>

    <div class="aside-menu-layout">
      <GaAsideMenu v-model:collapse="asideCollapsed" width="500px" default-active="1-1" unique-opened
       @select="handleSelect" @toggle="handleToggle">
        <template #header>
          <div class="aside-logo" v-if="!asideCollapsed">
            <ElIcon>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M4 4h6v6h-6z" />
                <path d="M14 4h6v6h-6z" />
                <path d="M4 14h6v6h-6z" />
                <path d="M14 14h6v6h-6z" />
              </svg>
            </ElIcon>
            <span>Ga Admin</span>
          </div>
          <div class="logo" v-else>
            <ElIcon>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M4 4h6v6h-6z" />
                <path d="M14 4h6v6h-6z" />
                <path d="M4 14h6v6h-6z" />
                <path d="M14 14h6v6h-6z" />
              </svg>
            </ElIcon>
          </div>

        </template>

        <ElSubMenu index="1">
          <template #title>
            <ElIcon>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M12 3l7 3v5c0 5 -3.5 8 -7 9c-3.5 -1 -7 -4 -7 -9v-5z" />
              </svg>
            </ElIcon>
            <span>系统管理</span>
          </template>

          <ElMenuItem index="1-1">
            <ElIcon>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
              </svg>
            </ElIcon>
            <template #title>用户管理</template>
          </ElMenuItem>

          <ElMenuItem index="1-2">
            <ElIcon>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M5 11a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" />
                <path d="M8 11v-3a4 4 0 0 1 8 0v3" />
              </svg>
            </ElIcon>
            <template #title>权限管理</template>
          </ElMenuItem>
        </ElSubMenu>

        <ElSubMenu index="3">
          <template #title>
            <ElIcon>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M12 3l7 3v5c0 5 -3.5 8 -7 9c-3.5 -1 -7 -4 -7 -9v-5z" />
              </svg>
            </ElIcon>
            <span>系统管理</span>
          </template>

          <ElMenuItemGroup title="看板11212">
            <ElMenuItem index="2-1">
              <ElIcon>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M4 19l16 0" />
                  <path d="M7 16v-5" />
                  <path d="M12 16v-9" />
                  <path d="M17 16v-3" />
                </svg>
              </ElIcon>
              <template #title>数据概览</template>
            </ElMenuItem>
            <ElMenuItem index="2-2">
              <ElIcon>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                  <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                </svg>
              </ElIcon>
              <template #title>用户管理</template>
            </ElMenuItem>

            <ElMenuItem index="2-3">
              <ElIcon>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M5 11a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" />
                  <path d="M8 11v-3a4 4 0 0 1 8 0v3" />
                </svg>
              </ElIcon>
              <template #title>权限管理</template>
            </ElMenuItem>
          </ElMenuItemGroup>

          <ElMenuItemGroup title="看板11212">
            <ElMenuItem index="2-1">
              <ElIcon>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M4 19l16 0" />
                  <path d="M7 16v-5" />
                  <path d="M12 16v-9" />
                  <path d="M17 16v-3" />
                </svg>
              </ElIcon>
              <template #title>数据概览</template>
            </ElMenuItem>
            <ElMenuItem index="2-2">
              <ElIcon>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                  <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                </svg>
              </ElIcon>
              <template #title>用户管理</template>
            </ElMenuItem>
          </ElMenuItemGroup>
        </ElSubMenu>


        <template #footer>
          <div class="aside-logo"  v-if="!asideCollapsed">
            <ElIcon>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M4 4h6v6h-6z" />
                <path d="M14 4h6v6h-6z" />
                <path d="M4 14h6v6h-6z" />
                <path d="M14 14h6v6h-6z" />
              </svg>
            </ElIcon>
            <span>这里是底部</span>
          </div>
                    <div class="logo" v-else>
            <ElIcon>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M4 4h6v6h-6z" />
                <path d="M14 4h6v6h-6z" />
                <path d="M4 14h6v6h-6z" />
                <path d="M14 14h6v6h-6z" />
              </svg>
            </ElIcon>
          </div>
        </template>

        <!-- <template  #trigger="{ collapse, toggle }" >
          <div class="aside-logo" @click="handleClickToggle(toggle)">
            <ElIcon>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M4 4h6v6h-6z" />
                <path d="M14 4h6v6h-6z" />
                <path d="M4 14h6v6h-6z" />
                <path d="M14 14h6v6h-6z" />
              </svg>
            </ElIcon>
          </div>
        </template> -->
      </GaAsideMenu>

      <div class="aside-content">内容区</div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";

import {
  ElIcon,
  ElMenuItem,
  ElMenuItemGroup,
  ElSubMenu,
} from "element-plus";

import { GaAsideMenu } from "ga-ui-plus/business";

const asideCollapsed = ref(false);

function handleClickToggle(toggle: () => void) {
   alert('22222222222');
  toggle();
}

function handleToggle(collapse: boolean) {
  alert("折叠状态切换为" + collapse);
  console.info("折叠状态切换为", collapse);
}

function handleSelect(index: string, indexPath: string[]) {
  console.info("选中菜单", index, indexPath);
}
</script>

<style scoped lang="scss">
.aside-menu-area {
  flex: none;
  padding-block: 16px;
}

.aside-menu-layout {
  display: flex;
  height: 400px;
  border: 1px solid var(--el-border-color);
}

.aside-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 56px;
  padding-inline: 16px;
  font-weight: 600;
}

.logo {
  display: flex;
  align-items: center;
  height: 56px;
  justify-content: center;
}

.aside-content {
  flex: 1;
  padding: 16px;
  background: var(--el-fill-color-light);
}

h2 {
  flex: none;
  font-size: 24px;
}
</style>
