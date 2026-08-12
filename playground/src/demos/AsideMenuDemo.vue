<template>
  <section class="aside-menu-area">
    <h2>GaAsideMenu 侧边栏菜单示例</h2>

    <div class="aside-menu-layout">
      <article class="example-card">
        <h3>配置驱动示例</h3>
        <div class="menu-preview">
          <GaAsideMenu
            v-model:collapse="configuredCollapsed"
            v-model:active="configuredActive"
            :items="configuredItems"
            width="280px"
            unique-opened
          >
            <template #header="{ collapse }">
              <div :class="collapse ? 'logo' : 'aside-logo'">
                <ElIcon><component :is="MenuGridIcon" /></ElIcon>
                <span v-if="!collapse">Ga Admin</span>
              </div>
            </template>

            <template #footer="{ collapse, active }">
              <div :class="collapse ? 'logo' : 'aside-logo'">
                <ElIcon v-if="!collapse">
                  <component :is="MenuGridIcon" />
                </ElIcon>
                <span class="aside-status-text">
                  {{
                    collapse
                      ? active || "未选择"
                      : `当前菜单：${active || "未选择"}`
                  }}
                </span>
              </div>
            </template>
          </GaAsideMenu>
        </div>
        <p class="active-state">
          当前激活：{{ configuredActive || "未选择" }}
        </p>
      </article>

      <article class="example-card">
        <h3>原生插槽兼容示例</h3>
        <div class="menu-preview">
          <GaAsideMenu
            v-model:collapse="legacyCollapsed"
            v-model:active="legacyActive"
            width="280px"
            default-active="1-1"
            unique-opened
            @select="handleLegacySelect"
          >
            <template #header="{ collapse }">
              <div class="aside-logo" v-if="!collapse">
                <ElIcon>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M4 4h6v6h-6z" />
                    <path d="M14 4h6v6h-6z" />
                    <path d="M4 14h6v6h-6z" />
                    <path d="M14 14h6v6h-6z" />
                  </svg>
                </ElIcon>
                <span>Navigator One</span>
              </template>
              <ElMenuItemGroup title="Group One">
                <ElMenuItem index="1-1">item one</ElMenuItem>
                <ElMenuItem index="1-2">item two</ElMenuItem>
              </ElMenuItemGroup>
              <ElMenuItemGroup title="Group Two">
                <ElMenuItem index="1-3">item three</ElMenuItem>
              </ElMenuItemGroup>
              <ElSubMenu index="1-4">
                <template #title>item four</template>
                <ElMenuItem index="1-4-1">item one</ElMenuItem>
              </ElSubMenu>
            </ElSubMenu>
            <ElMenuItem index="2">
              <ElIcon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M4 4h6v6h-6z" />
                  <path d="M14 4h6v6h-6z" />
                  <path d="M4 14h6v6h-6z" />
                  <path d="M14 14h6v6h-6z" />
                </svg>
              </ElIcon>
              <span>Navigator Two</span>
            </ElMenuItem>
            <ElMenuItem index="3" disabled>
              <ElIcon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M4 4h6v6h-6z" />
                  <path d="M14 4h6v6h-6z" />
                  <path d="M4 14h6v6h-6z" />
                  <path d="M14 14h6v6h-6z" />
                </svg>
              </ElIcon>
              <span>Navigator Three</span>
            </ElMenuItem>
            <ElMenuItem index="4">
              <ElIcon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M4 4h6v6h-6z" />
                  <path d="M14 4h6v6h-6z" />
                  <path d="M4 14h6v6h-6z" />
                  <path d="M14 14h6v6h-6z" />
                </svg>
              </ElIcon>
              <span>Navigator Four</span>
            </ElMenuItem>

            <template #footer="{ collapse }">
              <div class="aside-logo" v-if="!collapse">
                <ElIcon>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M4 4h6v6h-6z" />
                    <path d="M14 4h6v6h-6z" />
                    <path d="M4 14h6v6h-6z" />
                    <path d="M14 14h6v6h-6z" />
                  </svg>
                </ElIcon>
              </div>
            </template>
          </GaAsideMenu>
        </div>
        <p class="active-state">
          Legacy 当前激活：{{ legacyActive || "未选择" }}
        </p>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { defineComponent, h, markRaw, ref } from "vue";
import {
  ElIcon,
  ElMenuItem,
  ElMenuItemGroup,
  ElSubMenu,
} from "element-plus";
import {
  GaAsideMenu,
  type GaAsideMenuNode,
} from "ga-ui-plus/business";

const MenuGridIcon = markRaw(
  defineComponent({
    name: "MenuGridIcon",
    setup() {
      return () =>
        h(
          "svg",
          {
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
          },
          [
            h("path", { stroke: "none", d: "M0 0h24v24H0z", fill: "none" }),
            h("path", { d: "M4 4h6v6h-6z" }),
            h("path", { d: "M14 4h6v6h-6z" }),
            h("path", { d: "M4 14h6v6h-6z" }),
            h("path", { d: "M14 14h6v6h-6z" }),
          ],
        );
    },
  }),
);

const configuredCollapsed = ref(false);
const configuredActive = ref("users");
const legacyCollapsed = ref(false);
const legacyActive = ref("1-1");

const configuredItems: readonly GaAsideMenuNode[] = [
  {
    type: "submenu",
    index: "system",
    label: "系统管理",
    icon: MenuGridIcon,
    children: [
      {
        type: "group",
        label: "账号管理",
        children: [
          { type: "item", index: "users", label: "用户管理" },
          { type: "item", index: "roles", label: "角色管理" },
          {
            type: "item",
            index: "permissions",
            label: "权限管理",
            disabled: true,
          },
          {
            type: "item",
            index: "hidden-audit",
            label: "审计日志",
            hidden: true,
          },
        ],
      },
    ],
  },
  {
    type: "item",
    index: "reports",
    label: "报表中心",
    icon: MenuGridIcon,
  },
];

function handleLegacySelect(index: string) {
  legacyActive.value = index;
}
</script>

<style scoped lang="scss">
.aside-menu-area {
  flex: none;
  padding-block: 16px;
}

.aside-menu-layout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 340px), 1fr));
  gap: 20px;
}

.example-card {
  min-width: 0;
  padding: 16px;
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
  background: var(--el-bg-color);
}

.example-card h3 {
  margin: 0 0 12px;
  font-size: 16px;
}

.menu-preview {
  display: flex;
  height: 400px;
  overflow: hidden;
  border: 1px solid var(--el-border-color-lighter);
  background: var(--el-fill-color-light);
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
  justify-content: center;
  height: 56px;
}

.active-state {
  margin: 12px 0 0;
  color: var(--el-text-color-regular);
  font-size: 14px;
}

.aside-status-text {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.logo .aside-status-text {
  max-width: 56px;
  font-size: 12px;
}

h2 {
  flex: none;
  margin-top: 0;
  font-size: 24px;
}
</style>
