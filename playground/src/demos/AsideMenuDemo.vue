<template>
  <div class="aside-demo">
    <GaAsideMenu
      v-model:collapse="collapsed"
      width="248px"
      collapse-width="68px"
      :default-active="activeMenu"
      :default-openeds="['workspace']"
      unique-opened
      @select="handleSelect"
    >
      <template #header="{ collapse }">
        <div class="aside-brand">
          <span class="aside-brand__mark">G</span>
          <span v-if="!collapse" class="aside-brand__text">Ga Workspace</span>
        </div>
      </template>

      <ElMenuItem index="overview">
        <ElIcon><DataAnalysis /></ElIcon>
        <template #title>工作概览</template>
      </ElMenuItem>

      <ElSubMenu index="workspace">
        <template #title>
          <ElIcon><Grid /></ElIcon>
          <span>工作空间</span>
        </template>
        <ElMenuItem index="projects">
          <ElIcon><Folder /></ElIcon>
          <template #title>项目管理</template>
        </ElMenuItem>
        <ElMenuItem index="tasks">
          <ElIcon><Tickets /></ElIcon>
          <template #title>任务中心</template>
        </ElMenuItem>
        <ElMenuItem index="calendar">
          <ElIcon><Calendar /></ElIcon>
          <template #title>日程安排</template>
        </ElMenuItem>
      </ElSubMenu>

      <ElSubMenu index="operations">
        <template #title>
          <ElIcon><TrendCharts /></ElIcon>
          <span>运营分析</span>
        </template>
        <ElMenuItem index="reports">
          <ElIcon><Document /></ElIcon>
          <template #title>数据报表</template>
        </ElMenuItem>
        <ElMenuItem index="alerts">
          <ElIcon><Bell /></ElIcon>
          <template #title>告警中心</template>
        </ElMenuItem>
      </ElSubMenu>

      <ElMenuItem index="members">
        <ElIcon><User /></ElIcon>
        <template #title>成员管理</template>
      </ElMenuItem>

      <ElMenuItem index="settings">
        <ElIcon><Setting /></ElIcon>
        <template #title>系统设置</template>
      </ElMenuItem>

      <template #footer="{ collapse }">
        <div class="aside-user">
          <span class="aside-user__avatar">GA</span>
          <span v-if="!collapse" class="aside-user__meta">
            <strong>管理员</strong>
            <small>admin@ga-ui.dev</small>
          </span>
        </div>
      </template>

      <template #collapse="{ collapse, toggle }">
        <button
          type="button"
          class="aside-collapse"
          :aria-label="collapse ? '展开侧边栏' : '折叠侧边栏'"
          @click="toggle"
        >
          <ElIcon>
            <Expand v-if="collapse" />
            <Fold v-else />
          </ElIcon>
          <span v-if="!collapse">收起侧边栏</span>
        </button>
      </template>
    </GaAsideMenu>

    <main class="aside-demo__content">
      <header class="content-header">
        <div>
          <p class="content-header__eyebrow">Business / AsideMenu</p>
          <h1>{{ currentTitle }}</h1>
        </div>
        <ElTag effect="plain" type="success">组件运行中</ElTag>
      </header>

      <section class="content-summary" aria-label="菜单状态">
        <div>
          <span>当前菜单</span>
          <strong>{{ activeMenu }}</strong>
        </div>
        <div>
          <span>侧栏状态</span>
          <strong>{{ collapsed ? '已折叠' : '已展开' }}</strong>
        </div>
        <div>
          <span>展开宽度</span>
          <strong>248px</strong>
        </div>
      </section>

      <section class="content-panel">
        <div class="content-panel__head">
          <div>
            <span class="content-panel__index">01</span>
            <h2>插槽式菜单内容</h2>
          </div>
          <ElTag>Element Plus</ElTag>
        </div>
        <p>
          默认插槽中可以直接放置 ElMenuItem、ElSubMenu 和
          ElMenuItemGroup，菜单的层级、图标与文案都由业务方自由组织。
        </p>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import {
  Bell,
  Calendar,
  DataAnalysis,
  Document,
  Expand,
  Folder,
  Fold,
  Grid,
  Setting,
  Tickets,
  TrendCharts,
  User,
} from '@element-plus/icons-vue'
import { ElIcon, ElMenuItem, ElSubMenu, ElTag } from 'element-plus'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import { GaAsideMenu } from 'ga-ui-plus/business'

const compactLayout = window.matchMedia('(max-width: 720px)')
const collapsed = ref(compactLayout.matches)
const activeMenu = ref('projects')

const menuTitles: Record<string, string> = {
  overview: '工作概览',
  projects: '项目管理',
  tasks: '任务中心',
  calendar: '日程安排',
  reports: '数据报表',
  alerts: '告警中心',
  members: '成员管理',
  settings: '系统设置',
}

const currentTitle = computed(() => menuTitles[activeMenu.value] ?? '工作空间')

function handleSelect(index: string) {
  activeMenu.value = index
}

function handleCompactLayout(event: MediaQueryListEvent) {
  if (event.matches) collapsed.value = true
}

onMounted(() => compactLayout.addEventListener('change', handleCompactLayout))
onBeforeUnmount(() =>
  compactLayout.removeEventListener('change', handleCompactLayout),
)
</script>

<style scoped lang="scss">
:global(html),
:global(body),
:global(#app) {
  min-width: 0;
  min-height: 100%;
  margin: 0;
}

.aside-demo {
  box-sizing: border-box;
  display: flex;
  width: min(1180px, calc(100vw - 48px));
  height: min(760px, calc(100vh - 48px));
  min-height: 560px;
  margin: 24px auto;
  overflow: hidden;
  color: #202124;
  background: #f5f7fa;
  border: 1px solid #dfe3e8;
  box-shadow: 0 20px 50px rgb(32 33 36 / 10%);
}

.aside-brand,
.aside-user {
  display: flex;
  align-items: center;
  min-width: 0;
  height: 64px;
  padding: 0 14px;
}

.aside-brand {
  gap: 10px;
}

.aside-brand__mark,
.aside-user__avatar {
  display: grid;
  flex: 0 0 36px;
  width: 36px;
  height: 36px;
  color: #fff;
  font-weight: 700;
  place-items: center;
  background: #1f2937;
  border-radius: 6px;
}

.aside-brand__text {
  overflow: hidden;
  font-size: 16px;
  font-weight: 700;
  white-space: nowrap;
}

.aside-user {
  gap: 10px;
}

.aside-user__avatar {
  color: #1f2937;
  font-size: 12px;
  background: #dcebf7;
}

.aside-user__meta {
  display: flex;
  min-width: 0;
  flex-direction: column;
  line-height: 1.35;
}

.aside-user__meta strong,
.aside-user__meta small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.aside-user__meta strong {
  font-size: 13px;
}

.aside-user__meta small {
  color: #7a828d;
  font-size: 11px;
}

.aside-collapse {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 44px;
  padding: 0 14px;
  color: #60656d;
  font: inherit;
  cursor: pointer;
  background: #fff;
  border: 0;
}

.aside-collapse:hover,
.aside-collapse:focus-visible {
  color: var(--el-color-primary);
  background: #f2f6fc;
}

.aside-collapse:focus-visible {
  outline: 2px solid var(--el-color-primary);
  outline-offset: -2px;
}

.aside-demo__content {
  min-width: 0;
  flex: 1;
  padding: 32px;
  overflow: auto;
}

.content-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  padding-bottom: 28px;
  border-bottom: 1px solid #dfe3e8;
}

.content-header__eyebrow {
  margin: 0 0 8px;
  color: #6b7280;
  font-size: 12px;
  letter-spacing: 0;
  text-transform: uppercase;
}

.content-header h1 {
  margin: 0;
  font-size: 30px;
  line-height: 1.2;
}

.content-summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin: 28px 0;
  border-block: 1px solid #dfe3e8;
}

.content-summary > div {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 8px;
  padding: 20px 24px;
  border-right: 1px solid #dfe3e8;
}

.content-summary > div:last-child {
  border-right: 0;
}

.content-summary span {
  color: #727984;
  font-size: 12px;
}

.content-summary strong {
  overflow: hidden;
  font-size: 18px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.content-panel {
  padding: 26px;
  background: #fff;
  border: 1px solid #dfe3e8;
  border-radius: 6px;
}

.content-panel__head,
.content-panel__head > div {
  display: flex;
  align-items: center;
}

.content-panel__head {
  justify-content: space-between;
  gap: 16px;
}

.content-panel__head > div {
  gap: 12px;
}

.content-panel__index {
  display: grid;
  width: 32px;
  height: 32px;
  color: #fff;
  font-size: 12px;
  place-items: center;
  background: #1f2937;
  border-radius: 4px;
}

.content-panel h2 {
  margin: 0;
  font-size: 18px;
}

.content-panel p {
  max-width: 640px;
  margin: 20px 0 0;
  color: #60656d;
  line-height: 1.8;
}

@media (max-width: 720px) {
  .aside-demo {
    width: 100vw;
    height: 100vh;
    min-height: 0;
    margin: 0;
    border: 0;
  }

  .aside-demo__content {
    padding: 20px;
  }

  .content-header {
    align-items: stretch;
    flex-direction: column;
  }

  .content-summary {
    grid-template-columns: 1fr;
  }

  .content-summary > div {
    border-right: 0;
    border-bottom: 1px solid #dfe3e8;
  }

  .content-summary > div:last-child {
    border-bottom: 0;
  }
}
</style>
