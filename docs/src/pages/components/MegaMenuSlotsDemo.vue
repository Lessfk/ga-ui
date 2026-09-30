<template>
  <div class="mega-demo-nav">
    <GaMegaMenu
      v-model:active-key="activeKey"
      :menus="menus"
      :close-on-select="false"
      :max-height="320"
      @select="handleSelect"
    >
      <template #menu-item="{ menu, open }">
        <ElIcon><Collection v-if="menu.key === 'library'" /><Tools v-else /></ElIcon>
        <span>{{ menu.label }}</span>
        <ElIcon v-if="open"><ArrowDown /></ElIcon>
      </template>

      <template #group-title="{ group }">
        <div class="custom-group-title"><ElIcon><FolderOpened /></ElIcon>{{ group.title }}</div>
      </template>

      <template #panel-item="{ item }">
        <div class="custom-panel-item">
          <strong>{{ item.label }}</strong>
          <small>{{ item.description }}</small>
        </div>
        <ElIcon><ArrowRight /></ElIcon>
      </template>

      <template #empty="{ menu }">{{ menu.label }}暂时没有可用项目</template>
    </GaMegaMenu>
  </div>
  <p class="mega-demo-result">最近选择：{{ selectedLabel }}</p>
</template>

<script setup lang="ts">
import { ArrowDown, ArrowRight, Collection, FolderOpened, Tools } from '@element-plus/icons-vue'
import { ElIcon } from 'element-plus'
import { ref } from 'vue'
import {
  GaMegaMenu,
  type GaMegaMenuKey,
  type GaMegaMenuNavItem,
  type GaMegaMenuSelectPayload,
} from 'ga-ui-plus/base'

const activeKey = ref<GaMegaMenuKey>()
const selectedLabel = ref('暂无')
const menus: GaMegaMenuNavItem[] = [
  {
    key: 'library',
    label: '资源库',
    groups: [
      {
        key: 'resources',
        title: '常用资源',
        items: [
          { key: 'templates', label: '模板中心', description: '复用项目模板' },
          { key: 'assets', label: '素材管理', description: '整理文件和图片' },
        ],
      },
    ],
  },
  { key: 'tools', label: '工具', groups: [] },
]

function handleSelect(payload: GaMegaMenuSelectPayload) {
  selectedLabel.value = payload.item?.label ?? payload.menu.label
}
</script>

<style scoped>
.mega-demo-nav { height: 72px; }
.mega-demo-result { margin: 14px 0 0; color: #606266; font-size: 13px; }

.custom-group-title {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 0 12px 10px;
  color: #b7c4da;
  font-size: 13px;
  font-weight: 600;
}

.custom-panel-item {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: 4px;
}

.custom-panel-item strong { font-size: 14px; }
.custom-panel-item small { color: #b7c4da; font-size: 12px; }
</style>
